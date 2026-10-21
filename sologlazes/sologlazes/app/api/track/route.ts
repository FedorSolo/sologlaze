import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|facebookexternalhit|preview|monitor|uptime|pingdom|curl|wget|python|axios|node-fetch|go-http|vercel/i;
const EVENTS = new Set(["add_to_cart", "purchase", "whatsapp_click", "ml_click", "instagram_click"]);
const ID = /^[a-z0-9]{8,40}$/i;

function clip(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().slice(0, max);
  return s || null;
}

function parseDevice(ua: string, width: number) {
  if (/ipad|tablet/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) return "Tablet";
  if (/mobi|iphone|android/i.test(ua)) return "Móvil";
  if (width > 0 && width < 640) return "Móvil";
  return "Escritorio";
}

function parseBrowser(ua: string) {
  if (/instagram/i.test(ua)) return "Instagram (app)";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "Facebook (app)";
  if (/SamsungBrowser/i.test(ua)) return "Samsung Internet";
  if (/Edg\//i.test(ua)) return "Edge";
  if (/OPR\/|Opera/i.test(ua)) return "Opera";
  if (/Firefox|FxiOS/i.test(ua)) return "Firefox";
  if (/Chrome|CriOS/i.test(ua)) return "Chrome";
  if (/Safari/i.test(ua)) return "Safari";
  return "Otro";
}

function header(req: Request, name: string) {
  const v = req.headers.get(name);
  if (!v) return null;
  try {
    return decodeURIComponent(v).slice(0, 80);
  } catch {
    return v.slice(0, 80);
  }
}

// La analítica nunca debe devolver error al navegador: siempre 204.
const done = () => new Response(null, { status: 204 });

export async function POST(req: Request) {
  try {
    const ua = req.headers.get("user-agent") ?? "";
    if (!ua || BOT.test(ua)) return done();

    const raw = await req.text();
    if (!raw || raw.length > 2000) return done();
    const b = JSON.parse(raw) as Record<string, unknown>;

    const type = b.t === "event" ? "event" : b.t === "pageview" ? "pageview" : null;
    const path = clip(b.p, 200);
    const visitorId = clip(b.v, 40);
    const sessionId = clip(b.ss, 40);
    if (!type || !path || !path.startsWith("/") || !visitorId || !sessionId) return done();
    if (!ID.test(visitorId) || !ID.test(sessionId)) return done();
    if (path.startsWith("/admin") || path.startsWith("/api")) return done();

    let name: string | null = null;
    if (type === "event") {
      name = clip(b.n, 40);
      if (!name || !EVENTS.has(name)) return done();
    }

    const label = clip(b.lb, 120);
    const rawValue = typeof b.val === "number" && Number.isFinite(b.val) ? Math.round(b.val) : null;
    const value = rawValue !== null && rawValue >= 0 && rawValue <= 100_000_000 ? rawValue : null;

    // Un pedido cuenta una sola vez aunque se recargue la página de confirmación.
    if (name === "purchase") {
      if (!label) return done();
      const exists = await prisma.analyticsEvent.findFirst({ where: { name: "purchase", label }, select: { id: true } });
      if (exists) return done();
    }

    const width = typeof b.w === "number" ? b.w : 0;

    await prisma.analyticsEvent.create({
      data: {
        type,
        name,
        path,
        label,
        value,
        source: clip(b.s, 60),
        utmMedium: clip(b.um, 60),
        utmCampaign: clip(b.uc, 80),
        device: parseDevice(ua, width),
        browser: parseBrowser(ua),
        country: header(req, "x-vercel-ip-country"),
        region: header(req, "x-vercel-ip-country-region"),
        city: header(req, "x-vercel-ip-city"),
        visitorId,
        sessionId,
      },
    });
  } catch {
    // se ignora: no vale la pena romper nada por una métrica
  }
  return done();
}
