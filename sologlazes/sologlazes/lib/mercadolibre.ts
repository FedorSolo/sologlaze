import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { notifyTelegramMercadoLibre, sendTelegramDocument } from "@/lib/telegram";

// Продажи с Mercado Libre → заказы интернет-магазина (номер ML-<id заказа ML>) + сообщение в Telegram.
// Только чтение из ML: на Mercado Libre ничего не отправляется и не меняется.
//
// Переменные окружения в Vercel:
//   ML_APP_ID     — App ID приложения на developers.mercadolibre.com.ar
//   ML_SECRET_KEY — Secret Key того же приложения
//   ML_REDIRECT_URI (необязательно) — по умолчанию https://www.sologlazes.com.ar/api/mercadolibre/callback
//
// Ключи доступа к ML (access/refresh token) хранятся в таблице Account (provider = "mercadolibre").

const API = "https://api.mercadolibre.com";
const PROVIDER = "mercadolibre";

export const mlConfigured = () => Boolean(process.env.ML_APP_ID && process.env.ML_SECRET_KEY);
export const mlRedirectUri = () =>
  process.env.ML_REDIRECT_URI ?? "https://www.sologlazes.com.ar/api/mercadolibre/callback";

// ---------- OAuth

export function mlAuthUrl(state: string, codeChallenge: string) {
  const u = new URL("https://auth.mercadolibre.com.ar/authorization");
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", process.env.ML_APP_ID ?? "");
  u.searchParams.set("redirect_uri", mlRedirectUri());
  u.searchParams.set("state", state);
  u.searchParams.set("code_challenge", codeChallenge);
  u.searchParams.set("code_challenge_method", "S256");
  return u.toString();
}

// PKCE-ключ выводится из подписанного state, а не хранится в cookie:
// так подключение не ломается, если браузер (Telegram, другой домен www/без www) не вернул cookie.
export function pkceFromState(state: string) {
  const verifier = crypto.createHmac("sha256", process.env.ML_SECRET_KEY ?? "").update(`pkce:${state}`).digest("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

type TokenResponse = { access_token: string; refresh_token?: string; expires_in: number; user_id: number; scope?: string; token_type?: string };

async function tokenRequest(params: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(`${API}/oauth/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: new URLSearchParams({
      client_id: process.env.ML_APP_ID ?? "",
      client_secret: process.env.ML_SECRET_KEY ?? "",
      ...params,
    }),
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Mercado Libre token: ${res.status} ${data?.message ?? data?.error ?? ""}`.trim());
  return data as TokenResponse;
}

/** Обмен кода из callback на ключи и сохранение подключения. */
export async function mlConnect(code: string, verifier: string, adminUserId: string) {
  const t = await tokenRequest({ grant_type: "authorization_code", code, redirect_uri: mlRedirectUri(), code_verifier: verifier });
  const me = await fetch(`${API}/users/me`, { headers: { authorization: `Bearer ${t.access_token}` } }).then((r) => r.json());
  await prisma.account.deleteMany({ where: { provider: PROVIDER, NOT: { providerAccountId: String(t.user_id) } } });
  await prisma.account.upsert({
    where: { provider_providerAccountId: { provider: PROVIDER, providerAccountId: String(t.user_id) } },
    create: {
      userId: adminUserId,
      type: "oauth",
      provider: PROVIDER,
      providerAccountId: String(t.user_id),
      access_token: t.access_token,
      refresh_token: t.refresh_token ?? null,
      expires_at: Math.floor(Date.now() / 1000) + (t.expires_in ?? 21600),
      token_type: t.token_type ?? "bearer",
      scope: t.scope ?? null,
      session_state: String(me?.nickname ?? ""),
    },
    update: {
      userId: adminUserId,
      access_token: t.access_token,
      refresh_token: t.refresh_token ?? undefined,
      expires_at: Math.floor(Date.now() / 1000) + (t.expires_in ?? 21600),
      scope: t.scope ?? null,
      session_state: String(me?.nickname ?? ""),
    },
  });
  return { userId: t.user_id, nickname: String(me?.nickname ?? ""), canRefresh: Boolean(t.refresh_token), scope: t.scope ?? "" };
}

// ---------- диагностика: когда последний раз приходило уведомление от ML, ошибки, синхронизация.
// Хранится JSON-ом в Account.id_token (поле у этой записи больше ни для чего не используется).
export type MlDiag = {
  lastWebhookAt?: string;
  lastWebhookTopic?: string;
  lastSyncAt?: string;
  lastError?: { at: string; msg: string; order?: string };
};
const readDiag = (raw: string | null | undefined): MlDiag => {
  try {
    return raw ? (JSON.parse(raw) as MlDiag) : {};
  } catch {
    return {};
  }
};
export async function mlNote(patch: MlDiag) {
  try {
    const acc = await prisma.account.findFirst({ where: { provider: PROVIDER }, select: { id: true, id_token: true } });
    if (!acc) return;
    await prisma.account.update({ where: { id: acc.id }, data: { id_token: JSON.stringify({ ...readDiag(acc.id_token), ...patch }) } });
  } catch (e) {
    console.error("mlNote", e);
  }
}

export async function mlStatus() {
  const acc = await prisma.account.findFirst({ where: { provider: PROVIDER } });
  return {
    configured: mlConfigured(),
    connected: Boolean(acc),
    nickname: acc?.session_state ?? "",
    sellerId: acc?.providerAccountId ?? "",
    diag: readDiag(acc?.id_token),
  };
}

/** Запасной путь: подтянуть продажи, если давно не проверяли (уведомление от ML могло не прийти). */
export async function mlSyncIfStale(maxAgeMs = 10 * 60e3) {
  const st = await mlStatus();
  if (!st.connected) return null;
  const last = st.diag.lastSyncAt ? Date.parse(st.diag.lastSyncAt) : 0;
  if (Date.now() - last < maxAgeMs) return null;
  await mlNote({ lastSyncAt: new Date().toISOString() }); // сразу, чтобы параллельные вызовы не дублировали
  return syncMlOrders({ limit: 50, notifyNewerThanMs: 3 * 24 * 3600e3 });
}

async function mlAccount() {
  const acc = await prisma.account.findFirst({ where: { provider: PROVIDER } });
  if (!acc) throw new Error("Mercado Libre не подключён");
  if (acc.access_token && (acc.expires_at ?? 0) > Date.now() / 1000 + 300) return acc;
  if (!acc.refresh_token) throw new Error("Доступ к Mercado Libre истёк, а ключ продления (offline_access) ML не выдал — включите его в приложении ML и подключите заново");
  // refresh token у ML одноразовый: сразу сохраняем новый
  const t = await tokenRequest({ grant_type: "refresh_token", refresh_token: acc.refresh_token });
  return prisma.account.update({
    where: { id: acc.id },
    data: {
      access_token: t.access_token,
      refresh_token: t.refresh_token ?? acc.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + (t.expires_in ?? 21600),
    },
  });
}

async function mlGet<T = any>(path: string): Promise<T> {
  const acc = await mlAccount();
  const res = await fetch(`${API}${path}`, {
    headers: { authorization: `Bearer ${acc.access_token}`, accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Mercado Libre ${path}: ${res.status} ${data?.message ?? ""}`.trim());
  return data as T;
}

// ---------- заказы

type MlOrder = {
  id: number;
  status: string; // paid | confirmed | payment_required | payment_in_process | partially_paid | cancelled | invalid
  date_created: string;
  total_amount: number;
  paid_amount?: number;
  pack_id?: number | null;
  shipping?: { id?: number | null } | null;
  seller?: { id: number };
  buyer?: { id: number; nickname?: string; first_name?: string; last_name?: string };
  order_items: {
    item: { id: string; title: string; seller_sku?: string | null; seller_custom_field?: string | null; variation_attributes?: { name: string; value_name: string }[] };
    quantity: number;
    unit_price: number;
    sale_fee?: number;
  }[];
};

function mapStatus(s: string): { status: "PENDING" | "PAID" | "CANCELLED"; paymentStatus: "PENDING" | "PAID" | "FAILED" } {
  if (s === "paid") return { status: "PAID", paymentStatus: "PAID" };
  if (s === "cancelled" || s === "invalid") return { status: "CANCELLED", paymentStatus: "FAILED" };
  return { status: "PENDING", paymentStatus: "PENDING" };
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Загрузить заказ ML в магазин. Повторный вызов обновляет статус (оплата, отмена).
 * notify — писать ли в Telegram (новая продажа / отмена).
 */
export async function importMlOrder(mlOrderId: string | number, opts: { notify?: boolean; label?: boolean; order?: MlOrder } = {}) {
  // поиск заказов ML уже возвращает заказ целиком — тогда повторно не запрашиваем
  const o = opts.order?.order_items ? opts.order : await mlGet<MlOrder>(`/orders/${mlOrderId}`);
  const number = `ML-${o.id}`;
  const st = mapStatus(o.status);
  const existing = await prisma.order.findUnique({ where: { orderNumber: number }, select: { id: true, status: true, paymentStatus: true } });

  if (existing) {
    // не трогаем то, что вы уже поменяли в админке (отправлен, доставлен…), кроме отмены и оплаты
    const next =
      st.status === "CANCELLED" && existing.status !== "CANCELLED"
        ? { status: "CANCELLED" as const }
        : st.status === "PAID" && existing.status === "PENDING"
          ? { status: "PAID" as const, paymentStatus: "PAID" as const }
          : null;
    if (!next) {
      if (opts.label) await sendMlLabel(existing.id, o).catch((e) => console.error("ML label", o.id, e));
      return { id: existing.id, created: false, changed: false };
    }
    await prisma.order.update({
      where: { id: existing.id },
      data: { ...next, statusHistory: { create: { status: next.status, note: `Mercado Libre: ${o.status}` } } },
    });
    if (opts.notify) await notifyTelegramMercadoLibre(existing.id, next.status === "CANCELLED" ? "cancelled" : "paid");
    if (opts.label) await sendMlLabel(existing.id, o).catch((e) => console.error("ML label", o.id, e));
    return { id: existing.id, created: false, changed: true };
  }

  // сопоставляем товар ML с вариантом на сайте по SKU, если он указан в объявлении
  const skus = o.order_items.map((i) => i.item.seller_sku || i.item.seller_custom_field).filter((s): s is string => Boolean(s));
  const variants = skus.length ? await prisma.productVariant.findMany({ where: { sku: { in: skus } }, select: { id: true, sku: true } }) : [];
  const bySku = new Map(variants.map((v) => [v.sku, v.id]));

  const items = o.order_items.map((i) => ({
    variantId: bySku.get(i.item.seller_sku || i.item.seller_custom_field || "") ?? null,
    productNameSnapshot: i.item.title.slice(0, 190),
    variantLabelSnapshot: (i.item.variation_attributes ?? []).map((a) => a.value_name).filter(Boolean).join(", ").slice(0, 60) || null,
    unitPriceSnapshot: r2(i.unit_price),
    quantity: i.quantity,
  }));
  const subtotal = r2(items.reduce((s, i) => s + i.unitPriceSnapshot * i.quantity, 0));
  const fee = r2(o.order_items.reduce((s, i) => s + (i.sale_fee ?? 0) * i.quantity, 0));
  const buyer = [o.buyer?.first_name, o.buyer?.last_name].filter(Boolean).join(" ");
  const comment = [
    `[Mercado Libre] Заказ ML #${o.id}${o.pack_id ? ` (корзина ${o.pack_id})` : ""}`,
    `Покупатель: ${o.buyer?.nickname ?? "—"}${buyer ? ` (${buyer})` : ""}`,
    fee ? `Комиссия ML: $${fee.toLocaleString("es-AR")} · вам остаётся ≈ $${r2(o.total_amount - fee).toLocaleString("es-AR")} (без учёта доставки)` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const address = await prisma.address.create({
    data: { label: "Mercado Libre", street: "-", number: "", city: "-", province: "-", postalCode: "-" },
  });
  try {
    const order = await prisma.order.create({
      data: {
        orderNumber: number,
        status: st.status,
        paymentStatus: st.paymentStatus,
        paymentProvider: "MERCADO_PAGO",
        subtotal,
        shippingCost: 0,
        total: r2(o.total_amount || subtotal),
        shippingAddressId: address.id,
        customerComment: comment,
        createdAt: new Date(o.date_created),
        items: { create: items },
        statusHistory: { create: { status: st.status, note: `Загружен из Mercado Libre (${o.status})` } },
      },
    });
    if (opts.notify && st.status !== "CANCELLED") await notifyTelegramMercadoLibre(order.id, "new");
    if (opts.label) await sendMlLabel(order.id, o).catch((e) => console.error("ML label", o.id, e));
    return { id: order.id, created: true, changed: true };
  } catch (e: any) {
    await prisma.address.delete({ where: { id: address.id } }).catch(() => {});
    if (e?.code === "P2002") return { id: "", created: false, changed: false }; // параллельное уведомление уже создало заказ
    throw e;
  }
}

/** Подтянуть последние продажи (на случай пропущенных уведомлений). Уведомляет только о свежих. */
export async function syncMlOrders(opts: { notifyNewerThanMs?: number; limit?: number } = {}) {
  const acc = await mlAccount();
  const data = await mlGet<{ results: MlOrder[] }>(
    `/orders/search?seller=${acc.providerAccountId}&sort=date_desc&limit=${Math.min(opts.limit ?? 50, 50)}`,
  );
  let created = 0;
  let changed = 0;
  for (const r of data.results ?? []) {
    const fresh = opts.notifyNewerThanMs ? Date.now() - new Date(r.date_created).getTime() < opts.notifyNewerThanMs : false;
    try {
      const res = await importMlOrder(r.id, { notify: fresh, label: fresh, order: r });
      if (res.created) created++;
      else if (res.changed) changed++;
    } catch (e) {
      console.error("ML sync", r.id, e);
      await mlNote({ lastError: { at: new Date().toISOString(), msg: e instanceof Error ? e.message : String(e), order: String(r.id) } });
    }
  }
  await mlNote({ lastSyncAt: new Date().toISOString() });
  return { created, changed, checked: data.results?.length ?? 0 };
}

// ---------- этикетки отправлений (Mercado Envíos)

const LABEL_NOTE = "🏷 Этикетка ML отправлена";

async function mlGetPdf(path: string): Promise<ArrayBuffer> {
  const acc = await mlAccount();
  const res = await fetch(`${API}${path}`, { headers: { authorization: `Bearer ${acc.access_token}` }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    let msg = t;
    try { msg = JSON.parse(t)?.message ?? t; } catch {}
    throw new Error(`Mercado Libre этикетка: ${res.status} ${String(msg).slice(0, 160)}`.trim());
  }
  return res.arrayBuffer();
}

/**
 * Прислать PDF этикетки в Telegram, когда посылка готова к отправке.
 * Автоматически — один раз на отправление (у корзины ML несколько заказов делят одно отправление).
 * force — по кнопке в приложении: прислать ещё раз (to — кому).
 */
export async function sendMlLabel(orderDbId: string, o: MlOrder, opts: { force?: boolean; to?: string[] } = {}) {
  const shipId = o.shipping?.id;
  if (!shipId) {
    if (opts.force) throw new Error("Mercado Libre: у этой продажи нет отправления Mercado Envíos — этикетки нет");
    return { sent: false, reason: "no_shipping" };
  }
  if (!opts.force) {
    if (o.status !== "paid") return { sent: false, reason: "not_paid" };
    const already = await prisma.orderStatusHistory.findFirst({ where: { note: { contains: `envío ${shipId}` } }, select: { id: true } });
    if (already) return { sent: false, reason: "already" };
  }
  const sh = await mlGet<{ status?: string; substatus?: string; logistic_type?: string; tracking_number?: string }>(`/shipments/${shipId}`);
  if (sh.status !== "ready_to_ship") {
    if (opts.force) {
      const human: Record<string, string> = { pending: "ещё не готово", handling: "ML ещё готовит отправление", shipped: "уже отправлено", delivered: "уже доставлено", cancelled: "отменено" };
      throw new Error(`Mercado Libre: этикетка недоступна — отправление ${human[sh.status ?? ""] ?? sh.status ?? "неизвестно"}`);
    }
    return { sent: false, reason: sh.status ?? "unknown" };
  }
  const pdf = await mlGetPdf(`/shipment_labels?shipment_ids=${shipId}&response_type=pdf`);
  const order = await prisma.order.findUnique({ where: { id: orderDbId }, select: { orderNumber: true, status: true, items: { select: { productNameSnapshot: true, quantity: true } } } });
  const what = (order?.items ?? []).map((i) => `${i.productNameSnapshot} × ${i.quantity}`).join(", ").slice(0, 600);
  const h = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const caption = `🏷 Этикетка Mercado Libre <code>${h(order?.orderNumber ?? `ML-${o.id}`)}</code>\n${h(what)}`;
  const n = await sendTelegramDocument(pdf, `etiqueta-ML-${o.id}.pdf`, caption, opts.to);
  if (n > 0 && order && !opts.force) {
    await prisma.orderStatusHistory.create({ data: { orderId: orderDbId, status: order.status, note: `${LABEL_NOTE} (envío ${shipId})` } });
  }
  return { sent: n > 0, reason: n > 0 ? "ok" : "telegram" };
}

/** По кнопке «Этикетка» в Telegram-приложении: прислать этикетку тому, кто нажал. */
export async function sendMlLabelFor(orderDbId: string, chatId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderDbId }, select: { orderNumber: true } });
  if (!order?.orderNumber.startsWith("ML-")) throw new Error("Mercado Libre: это не заказ с Mercado Libre");
  const o = await mlGet<MlOrder>(`/orders/${order.orderNumber.slice(3)}`);
  return sendMlLabel(orderDbId, o, { force: true, to: [chatId] });
}

// ---------- state для OAuth (защита от подделки callback)

export function signState(payload: string) {
  const sig = crypto.createHmac("sha256", process.env.ML_SECRET_KEY ?? "").update(payload).digest("base64url");
  return `${payload}.${sig}`;
}
export function verifyState(state: string) {
  const i = state.lastIndexOf(".");
  if (i < 0) return null;
  const payload = state.slice(0, i);
  return signState(payload) === state ? payload : null;
}
