import { createSign } from "crypto";

// Cliente mínimo de Google Search Console (sin dependencias): cuenta de servicio → token → API.
// Variables de entorno (Vercel):
//   GSC_CLIENT_EMAIL  email de la cuenta de servicio (…@….iam.gserviceaccount.com)
//   GSC_PRIVATE_KEY   clave privada de esa cuenta (con \n literales o saltos de línea reales)
//   GSC_SITE_URL      propiedad en Search Console: "sc-domain:sologlazes.com.ar" o "https://sologlazes.com.ar/"

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

// Acepta la clave tal como suele quedar guardada en Vercel: con \n literales, sin saltos de línea,
// entre comillas, o incluso pegando el JSON completo de la cuenta de servicio.
function normalizeKey(raw: string): string {
  let v = raw.trim();
  if (v.startsWith("{")) {
    try {
      v = String((JSON.parse(v) as { private_key?: string }).private_key ?? "");
    } catch {
      // seguimos con el texto tal cual
    }
  }
  v = v.replace(/^["']+|["']+$/g, "").replace(/\\n/g, "\n").replace(/\r/g, "");
  const m = v.match(/-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END \1-----/);
  if (!m) return v;
  const body = m[2].replace(/[^A-Za-z0-9+/=]/g, "");
  return `-----BEGIN ${m[1]}-----\n${body.match(/.{1,64}/g)?.join("\n") ?? body}\n-----END ${m[1]}-----\n`;
}

export function gscConfig() {
  const rawKey = process.env.GSC_PRIVATE_KEY;
  let email = process.env.GSC_CLIENT_EMAIL?.trim().replace(/^["']+|["']+$/g, "");
  if (!email && rawKey?.trim().startsWith("{")) {
    try {
      email = (JSON.parse(rawKey) as { client_email?: string }).client_email;
    } catch {
      // nada
    }
  }
  const key = rawKey ? normalizeKey(rawKey) : "";
  const site = (process.env.GSC_SITE_URL ?? "sc-domain:sologlazes.com.ar").trim().replace(/^["']+|["']+$/g, "");
  return email && key ? { email, key, site } : null;
}

const b64 = (v: string | Buffer) => Buffer.from(v).toString("base64url");

let cached: { token: string; exp: number } | null = null;

async function accessToken(cfg: NonNullable<ReturnType<typeof gscConfig>>) {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64(
    JSON.stringify({ iss: cfg.email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 })
  )}`;
  const sig = createSign("RSA-SHA256").update(unsigned).sign(cfg.key);
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${b64(sig)}` }),
    cache: "no-store",
  });
  const json = (await res.json()) as { access_token?: string; expires_in?: number; error_description?: string; error?: string };
  if (!res.ok || !json.access_token) throw new Error(`Google no aceptó las credenciales: ${json.error_description ?? json.error ?? res.status}`);
  cached = { token: json.access_token, exp: Date.now() + (json.expires_in ?? 3600) * 1000 };
  return cached.token;
}

async function call<T>(url: string, init?: { body?: unknown; revalidate?: number }): Promise<T> {
  const cfg = gscConfig();
  if (!cfg) throw new Error("Search Console no está configurado.");
  const token = await accessToken(cfg);
  const res = await fetch(url, {
    method: init?.body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    ...(init?.revalidate ? { next: { revalidate: init.revalidate } } : { cache: "no-store" as const }),
  });
  const json = (await res.json().catch(() => ({}))) as T & { error?: { message?: string } };
  if (!res.ok) {
    const msg = json.error?.message ?? `HTTP ${res.status}`;
    throw new Error(
      res.status === 403
        ? `Sin permiso en Search Console (${msg}). Agregá el email de la cuenta de servicio como usuario de la propiedad.`
        : msg
    );
  }
  return json;
}

export type GscRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

export async function searchAnalytics(params: { startDate: string; endDate: string; dimensions?: string[]; rowLimit?: number }) {
  const cfg = gscConfig()!;
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(cfg.site)}/searchAnalytics/query`;
  const out = await call<{ rows?: GscRow[] }>(url, { body: { rowLimit: 25, ...params }, revalidate: 3600 });
  return out.rows ?? [];
}

export type GscSitemap = {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  errors?: string;
  warnings?: string;
  contents?: { type: string; submitted?: string; indexed?: string }[];
};

export async function listSitemaps() {
  const cfg = gscConfig()!;
  const out = await call<{ sitemap?: GscSitemap[] }>(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(cfg.site)}/sitemaps`, { revalidate: 3600 });
  return out.sitemap ?? [];
}

export type UrlInspection = {
  verdict: string; // PASS | NEUTRAL | FAIL | PARTIAL | VERDICT_UNSPECIFIED
  coverageState: string; // "Submitted and indexed", "Discovered - currently not indexed", …
  lastCrawlTime?: string;
  googleCanonical?: string;
};

export async function inspectUrl(inspectionUrl: string): Promise<UrlInspection> {
  const cfg = gscConfig()!;
  const out = await call<{ inspectionResult?: { indexStatusResult?: UrlInspection } }>("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    body: { inspectionUrl, siteUrl: cfg.site, languageCode: "es" },
  });
  const r = out.inspectionResult?.indexStatusResult;
  return { verdict: r?.verdict ?? "VERDICT_UNSPECIFIED", coverageState: r?.coverageState ?? "Sin datos", lastCrawlTime: r?.lastCrawlTime, googleCanonical: r?.googleCanonical };
}
