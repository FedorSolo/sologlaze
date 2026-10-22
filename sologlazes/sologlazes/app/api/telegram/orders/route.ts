import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";

// Заказы для вкладки «Заказы» в Telegram-приложении «Мастерская».
// Доступ: только из Telegram (проверка подписи initData токеном TELEGRAM_BOT_TOKEN)
// и только для Telegram ID из TELEGRAM_CHAT_IDS (и, по желанию, TELEGRAM_ORDER_VIEWERS).
// Новых переменных окружения не требуется.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-telegram-init-data",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "content-type": "application/json; charset=utf-8" } });

const ids = (v: string | undefined) =>
  (v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s));

function verifyInitData(initData: string, token: string): { id: number; first_name?: string } | null {
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

export async function OPTIONS() {
  return new Response("ok", { headers: CORS });
}

export async function POST(req: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return json({ error: "На сайте не задан TELEGRAM_BOT_TOKEN" }, 500);

  const user = verifyInitData(req.headers.get("x-telegram-init-data") ?? "", token);
  if (!user) return json({ error: "Подпись Telegram не прошла проверку — откройте приложение заново" }, 401);

  const allowed = new Set([...ids(process.env.TELEGRAM_CHAT_IDS), ...ids(process.env.TELEGRAM_ORDER_VIEWERS)]);
  if (!allowed.has(String(user.id))) return json({ error: "not_allowed", tgId: user.id }, 403);

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { items: true, shippingAddress: true, user: { select: { name: true, email: true, phone: true } } },
  });

  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sologlazes.com.ar").replace(/\/$/, "");

  return json({
    orders: orders.map((o) => {
      const a = o.shippingAddress;
      return {
        id: o.id,
        number: o.orderNumber,
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
        comment: o.customerComment,
        customer: o.user ? { name: o.user.name, email: o.user.email, phone: o.user.phone } : null,
        address: a
          ? [a.street && a.street !== "-" ? `${a.street} ${a.number ?? ""}`.trim() : "", a.city, a.province, a.postalCode]
              .filter((x) => x && x !== "-")
              .join(", ")
          : "",
        items: o.items.map((i) => ({
          name: i.productNameSnapshot,
          variant: i.variantLabelSnapshot,
          qty: i.quantity,
          price: Number(i.unitPriceSnapshot),
        })),
        adminUrl: `${site}/admin/pedidos/${o.id}`,
      };
    }),
  });
}
