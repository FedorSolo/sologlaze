import { after } from "next/server";
import { importMlOrder, mlNote, mlStatus, mlSyncIfStale } from "@/lib/mercadolibre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Mercado Libre шлёт сюда уведомления (тема orders_v2): { resource: "/orders/123", user_id, topic }.
// Отвечаем 200 сразу (иначе ML повторяет), а сам заказ запрашиваем у ML нашим ключом —
// поэтому подделать продажу через этот адрес нельзя.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { topic?: string; resource?: string; user_id?: number };
  const id = String(body.resource ?? "").match(/\/orders\/(\d+)/)?.[1];
  console.log("ML webhook:", body.topic, body.resource);
  after(async () => {
    const st = await mlStatus();
    if (!st.connected || (body.user_id && String(body.user_id) !== st.sellerId)) return;
    await mlNote({ lastWebhookAt: new Date().toISOString(), lastWebhookTopic: String(body.topic ?? "") });
    if ((body.topic === "orders_v2" || body.topic === "orders") && id) {
      try {
        await importMlOrder(id, { notify: true });
      } catch (e) {
        console.error("ML webhook", id, e);
        await mlNote({ lastError: { at: new Date().toISOString(), msg: e instanceof Error ? e.message : String(e), order: id } });
      }
    }
  });
  return new Response("ok");
}

export async function GET() {
  return new Response("ok");
}
