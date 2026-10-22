import { after } from "next/server";
import { importMlOrder, mlStatus } from "@/lib/mercadolibre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Mercado Libre шлёт сюда уведомления (тема orders_v2): { resource: "/orders/123", user_id, topic }.
// Отвечаем 200 сразу (иначе ML повторяет), а сам заказ запрашиваем у ML нашим ключом —
// поэтому подделать продажу через этот адрес нельзя.
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { topic?: string; resource?: string; user_id?: number };
  const id = String(body.resource ?? "").match(/\/orders\/(\d+)/)?.[1];
  if ((body.topic === "orders_v2" || body.topic === "orders") && id) {
    after(async () => {
      try {
        const st = await mlStatus();
        if (!st.connected || (body.user_id && String(body.user_id) !== st.sellerId)) return;
        await importMlOrder(id, { notify: true });
      } catch (e) {
        console.error("ML webhook", id, e);
      }
    });
  }
  return new Response("ok");
}

export async function GET() {
  return new Response("ok");
}
