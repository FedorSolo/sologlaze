import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { mlConnect, syncMlOrders, verifyState } from "@/lib/mercadolibre";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const page = (title: string, text: string, ok: boolean) =>
  new Response(
    `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{font:16px/1.5 system-ui,sans-serif;max-width:520px;margin:12vh auto;padding:0 16px;color:#18221f;background:#eef1f0}
.c{background:#fff;border:1px solid #cfd8d5;border-radius:12px;padding:24px}h1{font-size:20px;margin:0 0 8px;color:${ok ? "#2e7d4f" : "#b03a2e"}}</style></head>
<body><div class="c"><h1>${title}</h1><p>${text}</p></div></body></html>`,
    { status: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8" } },
  );

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") ?? "";
  if (!code) return page("Не подключено", "Mercado Libre не передал код. Попробуйте ещё раз: /api/mercadolibre/connect", false);

  const payload = verifyState(state);
  const session = await auth();
  const userId = session?.user?.id;
  if (!payload || !userId || !payload.startsWith(`${userId}:`) || Date.now() - Number(payload.split(":")[1]) > 15 * 60e3) {
    return page("Не подключено", "Ссылка устарела или вы вышли из админки. Войдите в админку сайта и откройте /api/mercadolibre/connect ещё раз.", false);
  }
  const jar = await cookies();
  const verifier = jar.get("ml_pkce")?.value ?? "";

  try {
    const me = await mlConnect(code, verifier, userId);
    let imported = "";
    try {
      const r = await syncMlOrders({ limit: 50 }); // загрузить последние продажи без сообщений в Telegram
      imported = ` Загружено продаж: ${r.created}.`;
    } catch (e) {
      console.error("ML first sync:", e);
    }
    return page(
      "Mercado Libre подключён",
      `Аккаунт <b>${esc(me.nickname)}</b>.${imported} Новые продажи будут приходить в Telegram и в заказы магазина. Эту страницу можно закрыть.`,
      true,
    );
  } catch (e) {
    console.error("ML connect:", e);
    return page("Не подключено", esc(e instanceof Error ? e.message : String(e)), false);
  }
}
