import { mlConnect, pkceFromState, syncMlOrders, verifyState } from "@/lib/mercadolibre";

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
  if (!code) return page("Не подключено", "Mercado Libre не передал код. Нажмите «Подключить» в приложении ещё раз.", false);

  // state подписан секретом и содержит ID администратора, открывшего /connect, — сессия здесь не нужна
  const payload = verifyState(state);
  const [userId, ts] = (payload ?? "").split(":");
  if (!payload || !userId || Date.now() - Number(ts) > 15 * 60e3) {
    return page("Не подключено", "Ссылка устарела. Нажмите «Подключить» в приложении ещё раз.", false);
  }
  const { verifier } = pkceFromState(state);

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
    const msg = e instanceof Error ? e.message : String(e);
    const hint = /grant/i.test(msg) ? " Код от Mercado Libre одноразовый: не обновляйте эту страницу, а нажмите «Подключить» в приложении ещё раз." : "";
    return page("Не подключено", esc(msg) + hint, false);
  }
}
