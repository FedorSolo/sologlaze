import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { notifyTelegramMercadoLibre } from "@/lib/telegram";

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
  return { userId: t.user_id, nickname: String(me?.nickname ?? "") };
}

export async function mlStatus() {
  const acc = await prisma.account.findFirst({ where: { provider: PROVIDER } });
  return { configured: mlConfigured(), connected: Boolean(acc), nickname: acc?.session_state ?? "", sellerId: acc?.providerAccountId ?? "" };
}

async function mlAccount() {
  const acc = await prisma.account.findFirst({ where: { provider: PROVIDER } });
  if (!acc) throw new Error("Mercado Libre не подключён");
  if (acc.access_token && (acc.expires_at ?? 0) > Date.now() / 1000 + 300) return acc;
  if (!acc.refresh_token) throw new Error("Доступ к Mercado Libre истёк — подключите заново");
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
export async function importMlOrder(mlOrderId: string | number, opts: { notify?: boolean } = {}) {
  const o = await mlGet<MlOrder>(`/orders/${mlOrderId}`);
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
    if (!next) return { id: existing.id, created: false, changed: false };
    await prisma.order.update({
      where: { id: existing.id },
      data: { ...next, statusHistory: { create: { status: next.status, note: `Mercado Libre: ${o.status}` } } },
    });
    if (opts.notify) await notifyTelegramMercadoLibre(existing.id, next.status === "CANCELLED" ? "cancelled" : "paid");
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
  const data = await mlGet<{ results: { id: number; date_created: string }[] }>(
    `/orders/search?seller=${acc.providerAccountId}&sort=date_desc&limit=${Math.min(opts.limit ?? 50, 50)}`,
  );
  let created = 0;
  let changed = 0;
  for (const r of data.results ?? []) {
    const fresh = opts.notifyNewerThanMs ? Date.now() - new Date(r.date_created).getTime() < opts.notifyNewerThanMs : false;
    try {
      const res = await importMlOrder(r.id, { notify: fresh });
      if (res.created) created++;
      else if (res.changed) changed++;
    } catch (e) {
      console.error("ML sync", r.id, e);
    }
  }
  return { created, changed, checked: data.results?.length ?? 0 };
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
