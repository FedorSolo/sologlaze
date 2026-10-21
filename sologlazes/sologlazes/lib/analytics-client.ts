// Analítica propia — lado navegador.
// No usa cookies: guarda un id anónimo en localStorage (visitante) y una sesión que vence a los 30 min sin actividad.

const VID = "sg_vid";
const SID = "sg_sid";
const LAST = "sg_last";
const SRC = "sg_src";
export const IGNORE_KEY = "sg_ignore";
const SESSION_MS = 30 * 60 * 1000;

export type TrackEventName = "add_to_cart" | "purchase" | "whatsapp_click" | "ml_click" | "instagram_click";

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // sin almacenamiento: se cuenta igual, pero cada visita será un visitante nuevo
  }
}

function newId() {
  try {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  } catch {
    return (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 24);
  }
}

const SOURCES: [RegExp, string][] = [
  [/google/, "Google"],
  [/bing/, "Bing"],
  [/duckduckgo/, "DuckDuckGo"],
  [/yahoo/, "Yahoo"],
  [/yandex/, "Yandex"],
  [/instagram|^ig$/, "Instagram"],
  [/facebook|^fb$|^meta$/, "Facebook"],
  [/whatsapp|^wa$/, "WhatsApp"],
  [/mercadolibre/, "Mercado Libre"],
  [/youtube/, "YouTube"],
  [/tiktok/, "TikTok"],
  [/pinterest/, "Pinterest"],
  [/(^|\.)t\.co$|twitter|^x$/, "X / Twitter"],
];

function classifySource(): string {
  const params = new URLSearchParams(window.location.search);
  const utm = (params.get("utm_source") ?? "").trim().toLowerCase();
  let refHost = "";
  try {
    if (document.referrer) refHost = new URL(document.referrer).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    refHost = "";
  }
  if (refHost === window.location.hostname.replace(/^www\./, "")) refHost = "";

  const probe = utm || refHost;
  if (!probe) return "Directo";
  for (const [re, name] of SOURCES) if (re.test(probe)) return name;
  return (utm || refHost).slice(0, 60);
}

function getIds() {
  let vid = read(VID);
  if (!vid) {
    vid = newId();
    write(VID, vid);
  }

  const now = Date.now();
  const last = Number(read(LAST) ?? 0);
  let sid = read(SID);
  let source = read(SRC);
  if (!sid || !last || now - last > SESSION_MS) {
    sid = newId();
    source = classifySource();
    write(SID, sid);
    write(SRC, source);
  }
  write(LAST, String(now));
  return { vid, sid, source: source ?? "Directo" };
}

function disabled() {
  if (typeof window === "undefined") return true;
  if (read(IGNORE_KEY) === "1") return true; // el dueño del sitio (se marca al entrar al admin)
  if (navigator.doNotTrack === "1") return true;
  return false;
}

function send(body: Record<string, unknown>) {
  const json = JSON.stringify(body);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon("/api/track", new Blob([json], { type: "text/plain" }))) return;
  } catch {
    // cae al fetch
  }
  try {
    void fetch("/api/track", { method: "POST", body: json, keepalive: true, headers: { "Content-Type": "text/plain" } });
  } catch {
    // la analítica nunca debe romper el sitio
  }
}

function base() {
  const { vid, sid, source } = getIds();
  const params = new URLSearchParams(window.location.search);
  return {
    v: vid,
    ss: sid,
    s: source,
    um: params.get("utm_medium") ?? undefined,
    uc: params.get("utm_campaign") ?? undefined,
    w: window.innerWidth,
  };
}

export function trackPageview(path: string) {
  if (disabled()) return;
  send({ t: "pageview", p: path, ...base() });
}

export function track(name: TrackEventName, data: { label?: string; value?: number; path?: string } = {}) {
  if (disabled()) return;
  send({ t: "event", n: name, p: data.path ?? window.location.pathname, lb: data.label, val: data.value, ...base() });
}
