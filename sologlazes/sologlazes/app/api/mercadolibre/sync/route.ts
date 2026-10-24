import { mlSyncIfStale } from "@/lib/mercadolibre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Сверка продаж с Mercado Libre (запасной путь к уведомлениям). Вызывается по расписанию Vercel (vercel.json).
// Безопасно вызывать кому угодно: импортирует только наши же продажи, не чаще раза в 5 минут.
export async function GET() {
  try {
    const r = await mlSyncIfStale(5 * 60e3);
    return Response.json(r ? { ok: true, ...r } : { ok: true, skipped: true });
  } catch (e) {
    console.error("ML cron sync", e);
    return Response.json({ ok: false }, { status: 500 });
  }
}
