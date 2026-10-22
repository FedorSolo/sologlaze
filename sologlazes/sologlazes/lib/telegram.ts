import { prisma } from "@/lib/prisma";

// Уведомления о заказах в Telegram (бот «Мастерской»).
// Переменные окружения в Vercel:
//   TELEGRAM_BOT_TOKEN — токен бота от @BotFather
//   TELEGRAM_CHAT_IDS  — кому писать: Telegram ID через запятую (личные чаты или группа, у группы ID начинается с «-»)
// Если переменные не заданы — ничего не отправляется и сайт работает как раньше.

const PAYMENT_LABEL: Record<string, string> = {
  MERCADO_PAGO: "Mercado Pago",
  MANUAL: "Перевод / наличные",
  STRIPE: "Stripe",
};

const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const money = (n: unknown) => `$${Number(n ?? 0).toLocaleString("es-AR", { maximumFractionDigits: 2 })}`;

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://sologlazes.com.ar").replace(/\/$/, "");
}

async function sendTelegram(text: string, orderId?: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chats = (process.env.TELEGRAM_CHAT_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!token || chats.length === 0) return;

  const reply_markup = orderId
    ? { inline_keyboard: [[{ text: "Открыть заказ в админке", url: `${siteUrl()}/admin/pedidos/${orderId}` }]] }
    : undefined;

  await Promise.all(
    chats.map(async (chat_id) => {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true, reply_markup }),
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) console.error("Telegram:", res.status, await res.text());
      } catch (err) {
        console.error("Telegram: no se pudo enviar", err);
      }
    }),
  );
}

/** Новый заказ — вызывать после создания заказа. Никогда не бросает исключение. */
export async function notifyTelegramNewOrder(orderId: string, opts: { quick?: boolean } = {}) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, shippingAddress: true },
    });
    if (!order) return;

    const items = order.items
      .map(
        (i: { productNameSnapshot: string; variantLabelSnapshot: string | null; unitPriceSnapshot: unknown; quantity: number }) =>
          `• ${esc(i.productNameSnapshot)}${i.variantLabelSnapshot ? ` — ${esc(i.variantLabelSnapshot)}` : ""} × ${i.quantity} = ${money(Number(i.unitPriceSnapshot) * i.quantity)}`,
      )
      .join("\n");

    const a = order.shippingAddress;
    const address = opts.quick
      ? "уточнить по WhatsApp"
      : [a?.street, a?.city, a?.province, a?.postalCode].filter((x) => x && x !== "-").map(esc).join(", ");

    const lines = [
      `${opts.quick ? "⚡ <b>Быстрый заказ (WhatsApp)</b>" : "🛒 <b>Новый заказ</b>"} <code>${esc(order.orderNumber)}</code>`,
      "",
      items,
      "",
      Number(order.shippingCost) > 0 ? `Доставка: ${money(order.shippingCost)}${order.trackingCarrier ? ` (${esc(order.trackingCarrier)})` : ""}` : order.trackingCarrier ? `Доставка: ${esc(order.trackingCarrier)}` : "",
      `<b>Итого: ${money(order.total)}</b>`,
      `Оплата: ${esc(PAYMENT_LABEL[order.paymentProvider] ?? order.paymentProvider)} — ожидает`,
      address ? `Адрес: ${address}` : "",
      "",
      order.customerComment ? esc(order.customerComment) : "",
    ].filter((l, idx, arr) => l !== "" || (arr[idx - 1] ?? "") !== "");

    await sendTelegram(lines.join("\n").trim(), order.id);
  } catch (err) {
    console.error("notifyTelegramNewOrder:", err);
  }
}

/** Изменился статус оплаты Mercado Pago. Никогда не бросает исключение. */
export async function notifyTelegramPayment(orderId: string, status: "PAID" | "PENDING" | "FAILED" | "REFUNDED") {
  try {
    if (status === "PENDING") return;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return;
    const head =
      status === "PAID" ? "✅ <b>Оплачен</b>" : status === "FAILED" ? "❌ <b>Оплата не прошла</b>" : "↩️ <b>Возврат оплаты</b>";
    await sendTelegram(`${head} заказ <code>${esc(order.orderNumber)}</code> — ${money(order.total)} (Mercado Pago)`, order.id);
  } catch (err) {
    console.error("notifyTelegramPayment:", err);
  }
}
