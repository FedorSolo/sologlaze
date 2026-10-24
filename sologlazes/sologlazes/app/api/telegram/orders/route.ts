import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { mlStatus, mlSyncIfStale, syncMlOrders } from "@/lib/mercadolibre";
import { after } from "next/server";
import { parseOrderComment } from "@/lib/order-comment";
import { OutOfStockError } from "@/lib/stock";
import { moveToTrash, purgeFromTrash, restoreFromTrash, trashedOrderIds } from "@/lib/order-trash";

// Вкладка «Заказы» в Telegram-приложении «Мастерская».
// Доступ: только из Telegram (проверка подписи initData токеном TELEGRAM_BOT_TOKEN)
// и только для Telegram ID из TELEGRAM_CHAT_IDS (и, по желанию, TELEGRAM_ORDER_VIEWERS).
//
// action:
//   list    (по умолчанию) — последние заказы + сводка продаж по месяцам
//   catalog — товары сайта для формы «Добавить продажу»
//   create  — ручная продажа (Mercado Libre, мастерская, ярмарка…): создаётся обычный заказ
//             с номером M-xxxxxx, статус DELIVERED, оплата PAID — попадает и в статистику админки
//   delete  — удалить ручную продажу (только M-…)
//   mlSync  — подтянуть последние продажи с Mercado Libre

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-telegram-init-data",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "content-type": "application/json; charset=utf-8" } });

class HttpError extends Error {
  constructor(public status: number, msg: string) {
    super(msg);
  }
}

const ids = (v: string | undefined) =>
  (v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s));

type TgUser = { id: number; first_name?: string; last_name?: string; username?: string };

function verifyInitData(initData: string, token: string): TgUser | null {
  const p = new URLSearchParams(initData);
  const hash = p.get("hash") ?? "";
  p.delete("hash");
  const check = [...p.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(token).digest();
  const sig = crypto.createHmac("sha256", secret).update(check).digest("hex");
  if (sig.length !== hash.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(hash))) return null;
  const authDate = Number(p.get("auth_date") ?? 0);
  if (!authDate || Date.now() / 1000 - authDate > 7 * 24 * 3600) return null;
  try {
    const user = JSON.parse(p.get("user") ?? "{}");
    return user?.id ? user : null;
  } catch {
    return null;
  }
}

// ---------- ручные продажи
const MANUAL_CHANNELS = ["Mercado Libre", "Мастерская / лично", "Instagram / WhatsApp", "Ярмарка", "Оптом", "Другое"];
const MANUAL_TAG = /^\[Вручную · ([^\]]+)\]/;
const isManual = (o: { orderNumber: string }) => o.orderNumber.startsWith("M-");
const channelOf = (o: { orderNumber: string; customerComment: string | null }) =>
  o.orderNumber.startsWith("ML-") ? "Mercado Libre" : isManual(o) ? (o.customerComment ?? "").match(MANUAL_TAG)?.[1] ?? "Другое" : "Сайт";

// Продажа засчитывается в отчёт, если не отменена/не возвращена и деньги получены
// (оплата PAID или заказ уже в работе/отправлен/доставлен).
const counts = (o: { status: string; paymentStatus: string }) =>
  !["CANCELLED", "REFUNDED"].includes(o.status) &&
  (o.paymentStatus === "PAID" || ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"].includes(o.status));

const money = (v: unknown, name: string, min = 0) => {
  const n = Number(v);
  if (!isFinite(n) || n < min || n > 100_000_000) throw new HttpError(400, `${name}: неверная сумма`);
  return Math.round(n * 100) / 100;
};
const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const r2 = (n: number) => Math.round(n * 100) / 100;
const fmt = (n: number) => `$${n.toLocaleString("es-AR", { maximumFractionDigits: 2 })}`;

// скидка: { type: "pct" | "amt", value } от суммы base → сумма скидки
function discountOf(type: unknown, value: unknown, base: number, label: string) {
  const v = Number(value ?? 0);
  if (!v) return 0;
  if (!isFinite(v) || v < 0) throw new HttpError(400, `${label}: неверная скидка`);
  if (type === "pct") {
    if (v > 100) throw new HttpError(400, `${label}: скидка больше 100%`);
    return r2((base * v) / 100);
  }
  if (v > base + 0.001) throw new HttpError(400, `${label}: скидка больше суммы`);
  return r2(v);
}

async function list() {
  const trashed = await trashedOrderIds();
  const include = {
    items: { include: { variant: { select: { product: { select: { slug: true } } } } } },
    shippingAddress: true,
    user: { select: { name: true, email: true, phone: true } },
  } as const;
  // последние 80 заказов + всё, что лежит в корзине (даже старое)
  const latest = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 80, include });
  const have = new Set(latest.map((o) => o.id));
  const missing = Array.from(trashed).filter((id) => !have.has(id));
  const older = missing.length ? await prisma.order.findMany({ where: { id: { in: missing } }, include }) : [];
  const orders = [...latest, ...older];

  // сводка за 13 месяцев (текущий и 12 предыдущих)
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth() - 12, 1);
  const all = await prisma.order.findMany({
    where: { createdAt: { gte: from } },
    select: { orderNumber: true, customerComment: true, status: true, paymentStatus: true, total: true, createdAt: true, shippingCost: true },
  });
  const months: Record<string, { month: string; total: number; count: number; pending: number; channels: Record<string, { total: number; count: number }> }> = {};
  for (const o of all) {
    const d = new Date(o.createdAt);
    // месяц по времени Буэнос-Айреса (UTC−3)
    const local = new Date(d.getTime() - 3 * 3600e3);
    const key = `${local.getUTCFullYear()}-${String(local.getUTCMonth() + 1).padStart(2, "0")}`;
    const m = (months[key] ??= { month: key, total: 0, count: 0, pending: 0, channels: {} });
    if (counts(o)) {
      const ch = channelOf(o);
      const c = (m.channels[ch] ??= { total: 0, count: 0 });
      c.total += Number(o.total);
      c.count += 1;
      m.total += Number(o.total);
      m.count += 1;
    } else if (!["CANCELLED", "REFUNDED"].includes(o.status)) {
      m.pending += 1;
    }
  }

  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sologlazes.com.ar").replace(/\/$/, "");
  const ml = await mlStatus().catch(() => ({ configured: false, connected: false, nickname: "", sellerId: "", diag: {} as Record<string, unknown> }));
  // запасной путь: пока приложение открыто, раз в 10 минут сверяемся с ML
  if (ml.connected) after(() => mlSyncIfStale().catch((e) => console.error("ML auto-sync", e)));
  return {
    // когда ML подключён, его продажи приходят сами — вручную их не добавляем, чтобы не задвоить
    channels: ml.connected ? MANUAL_CHANNELS.filter((c) => c !== "Mercado Libre") : MANUAL_CHANNELS,
    ml: { configured: ml.configured, connected: ml.connected, nickname: ml.nickname, diag: ml.diag, connectUrl: `${site.replace("://sologlazes", "://www.sologlazes")}/api/mercadolibre/connect` },
    months: Object.values(months).sort((a, b) => (a.month < b.month ? 1 : -1)),
    orders: orders.map((o) => {
      const a = o.shippingAddress;
      const manual = isManual(o);
      return {
        id: o.id,
        number: o.orderNumber,
        manual,
        trashed: trashed.has(o.id),
        channel: channelOf(o),
        createdAt: o.createdAt,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentProvider: o.paymentProvider,
        subtotal: Number(o.subtotal),
        discount: Number(o.discount),
        shippingCost: Number(o.shippingCost),
        total: Number(o.total),
        carrier: o.trackingCarrier,
        tracking: o.trackingNumber,
        comment: manual ? (o.customerComment ?? "").replace(MANUAL_TAG, "").trim() : o.customerComment,
        customer: o.user ? { name: o.user.name, email: o.user.email, phone: o.user.phone } : null,
        address:
          a && !manual
            ? [a.street && a.street !== "-" ? `${a.street} ${a.number ?? ""}`.trim() : "", a.city, a.province, a.postalCode]
                .filter((x) => x && x !== "-")
                .join(", ")
            : "",
        items: o.items.map((i) => ({
          name: i.productNameSnapshot,
          variant: i.variantLabelSnapshot,
          qty: i.quantity,
          price: Number(i.unitPriceSnapshot),
          slug: i.variant?.product.slug ?? null, // для «Замешать заказ»: по slug находится рецепт
        })),
        // выбор глазурей в Pack Prueba (по 200 г): [{ product, picks: [{ series, name }] }]
        packs: manual || o.orderNumber.startsWith("ML-") ? [] : parseOrderComment(o.customerComment).packs,
        adminUrl: `${site}/admin/pedidos/${o.id}`,
      };
    }),
  };
}

async function catalog() {
  const variants = await prisma.productVariant.findMany({
    where: { product: { deletedAt: null } },
    include: { product: { select: { name: true, isActive: true, collection: { select: { name: true } } } } },
  });
  return {
    products: variants
      .map((v) => ({
        id: v.id,
        name: v.product.name,
        variant: v.label,
        price: Number(v.price),
        group: v.product.collection?.name ?? "",
        active: v.product.isActive,
      }))
      .sort((a, b) => (a.group + a.name + a.variant).localeCompare(b.group + b.name + b.variant, "es")),
  };
}

async function create(body: Record<string, unknown>, who: string) {
  const channel = MANUAL_CHANNELS.includes(String(body.channel)) ? String(body.channel) : "Другое";
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
  if (!rawItems.length) throw new HttpError(400, "Добавьте хотя бы один товар");

  const variantIds = rawItems.map((i: any) => i?.variantId).filter((v: unknown): v is string => typeof v === "string" && v.length < 40);
  const variants = variantIds.length
    ? await prisma.productVariant.findMany({ where: { id: { in: variantIds } }, include: { product: { select: { name: true } } } })
    : [];
  const byId = new Map(variants.map((v) => [v.id, v]));

  const items = rawItems.map((i: any, idx: number) => {
    const v = typeof i?.variantId === "string" ? byId.get(i.variantId) : undefined;
    const qty = Math.round(Number(i?.qty));
    if (!(qty >= 1 && qty <= 10000)) throw new HttpError(400, `Строка ${idx + 1}: количество — целое число от 1`);
    const name = v ? v.product.name : text(i?.name, 120);
    if (!name) throw new HttpError(400, `Строка ${idx + 1}: выберите товар или впишите название`);
    const price = money(i?.price, `Строка ${idx + 1}`);
    // скидка на позицию: в % или суммой на всю строку (цена × кол-во)
    const lineDiscount = discountOf(i?.discountType, i?.discount, r2(price * qty), `Строка ${idx + 1}`);
    return {
      variantId: v?.id ?? null,
      productNameSnapshot: name,
      variantLabelSnapshot: v ? v.label : text(i?.variant, 60) || null,
      unitPriceSnapshot: price,
      quantity: qty,
      _discount: lineDiscount,
      _discountNote: lineDiscount
        ? `${name}: −${i?.discountType === "pct" ? `${Number(i.discount)}% (${fmt(lineDiscount)})` : fmt(lineDiscount)}`
        : "",
    };
  });

  const subtotal = r2(items.reduce((s: number, i: { unitPriceSnapshot: number; quantity: number }) => s + i.unitPriceSnapshot * i.quantity, 0));
  const itemsDiscount = r2(items.reduce((s: number, i: { _discount: number }) => s + i._discount, 0));
  const shippingCost = money(body.shippingCost ?? 0, "Доставка");
  // скидка на весь заказ (после скидок на позиции), тоже в % или суммой
  const orderDiscount = discountOf(body.discountType, body.discount, r2(subtotal - itemsDiscount), "Скидка на заказ");
  const discount = r2(itemsDiscount + orderDiscount);
  const total = Math.max(0, r2(subtotal + shippingCost - discount));
  const discountNotes = [
    ...items.map((i: { _discountNote: string }) => i._discountNote).filter(Boolean),
    orderDiscount ? `На заказ: −${body.discountType === "pct" ? `${Number(body.discount)}% (${fmt(orderDiscount)})` : fmt(orderDiscount)}` : "",
  ].filter(Boolean);

  // дата продажи: YYYY-MM-DD (по Буэнос-Айресу), не в будущем; без даты — сейчас
  let createdAt = new Date();
  if (typeof body.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    const today = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
    if (body.date > today) throw new HttpError(400, "Дата продажи не может быть в будущем");
    if (body.date !== today) createdAt = new Date(`${body.date}T15:00:00Z`); // 12:00 по Буэнос-Айресу
  }

  const note = text(body.comment, 500);
  const comment = `[Вручную · ${channel}]${note ? " " + note : ""}${discountNotes.length ? `\nСкидки: ${discountNotes.join("; ")}` : ""}\nДобавил(а): ${who}`;

  const address = await prisma.address.create({
    data: { label: "Продажа вручную", street: "-", number: "", city: "-", province: "-", postalCode: "-" },
  });

  let order = null;
  for (let attempt = 0; attempt < 5 && !order; attempt++) {
    try {
      order = await prisma.order.create({
        data: {
          orderNumber: `M-${Math.floor(100000 + Math.random() * 900000)}`,
          status: "DELIVERED",
          subtotal,
          discount,
          shippingCost,
          total,
          shippingAddressId: address.id,
          customerComment: comment,
          paymentProvider: "MANUAL",
          paymentStatus: "PAID",
          createdAt,
          items: { create: items.map(({ _discount, _discountNote, ...it }: any) => it) },
          statusHistory: { create: { status: "DELIVERED", changedBy: who, note: `Продажа добавлена вручную (${channel}) из Telegram` } },
        },
      });
    } catch (e: any) {
      if (e?.code !== "P2002") throw e; // повтор только при совпадении номера
    }
  }
  if (!order) throw new HttpError(500, "Не удалось подобрать номер заказа, попробуйте ещё раз");
  return { ok: true, number: order.orderNumber };
}

export async function OPTIONS() {
  return new Response("ok", { headers: CORS });
}

export async function POST(req: Request) {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) throw new HttpError(500, "На сайте не задан TELEGRAM_BOT_TOKEN");

    const user = verifyInitData(req.headers.get("x-telegram-init-data") ?? "", token);
    if (!user) throw new HttpError(401, "Подпись Telegram не прошла проверку — откройте приложение заново");

    const allowed = new Set([...ids(process.env.TELEGRAM_CHAT_IDS), ...ids(process.env.TELEGRAM_ORDER_VIEWERS)]);
    if (!allowed.has(String(user.id))) return json({ error: "not_allowed", tgId: user.id }, 403);
    const who = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username || String(user.id);

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    switch (body.action ?? "list") {
      case "list":
        return json(await list());
      case "catalog":
        return json(await catalog());
      case "create":
        return json(await create(body, who));
      case "delete": // в корзину — любой заказ (сайт, ML, ручной)
        return json({ ok: true, n: await moveToTrash([text(body.id, 40)], who) });
      case "restore":
        return json({ ok: true, n: await restoreFromTrash([text(body.id, 40)], who) });
      case "purge": // навсегда — только из корзины
        return json({ ok: true, n: await purgeFromTrash([text(body.id, 40)]) });
      case "mlSync":
        return json({ ok: true, ...(await syncMlOrders({ limit: 50, notifyNewerThanMs: 3 * 24 * 3600e3 })) });
      default:
        throw new HttpError(400, "Неизвестное действие");
    }
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status);
    if (e instanceof OutOfStockError) return json({ error: `Не восстановить: ${e.message}` }, 409);
    console.error("telegram/orders:", e);
    return json({ error: "Ошибка на сайте, попробуйте ещё раз" }, 500);
  }
}
