import { gscConfig, searchAnalytics, listSitemaps, type GscRow, type GscSitemap } from "@/lib/gsc";
import { IndexChecker } from "@/components/admin/index-checker";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // la comprobación de indexación consulta decenas de páginas

const DAY = 24 * 60 * 60 * 1000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const fmt = (v: number) => Math.round(v).toLocaleString("es-AR");

function delta(cur: number, prev: number, invert = false) {
  if (prev === 0) return cur > 0 ? { text: "nuevo", up: !invert } : null;
  const d = ((cur - prev) / prev) * 100;
  return { text: `${d >= 0 ? "▲" : "▼"} ${Math.abs(d).toLocaleString("es-AR", { maximumFractionDigits: 0 })} %`, up: invert ? d <= 0 : d >= 0 };
}

const DEVICE: Record<string, string> = { MOBILE: "Celular", DESKTOP: "Computadora", TABLET: "Tablet" };

function SetupSteps() {
  return (
    <div className="max-w-2xl space-y-4 rounded-lg border border-border p-6 text-sm">
      <p className="text-body font-medium">Conectar Google Search Console (una sola vez, ~15 min)</p>
      <ol className="list-decimal space-y-3 pl-5 text-text-secondary">
        <li>
          Entrá a <a className="text-accent underline" href="https://search.google.com/search-console" target="_blank" rel="noreferrer">search.google.com/search-console</a> con tu cuenta de Google y agregá la propiedad <b>sologlazes.com.ar</b> (tipo «Dominio»; se verifica con un registro TXT en el DNS del dominio).
        </li>
        <li>
          En «Sitemaps» enviá <code className="rounded bg-surface-muted px-1">https://sologlazes.com.ar/sitemap.xml</code>.
        </li>
        <li>
          En <a className="text-accent underline" href="https://console.cloud.google.com" target="_blank" rel="noreferrer">Google Cloud Console</a>: creá un proyecto → «APIs y servicios» → habilitá <b>Google Search Console API</b> → «Credenciales» → crear <b>cuenta de servicio</b> → pestaña «Claves» → agregar clave → JSON (se descarga un archivo).
        </li>
        <li>
          En Search Console → Configuración → «Usuarios y permisos» → agregá el <b>email de la cuenta de servicio</b> (client_email del JSON) con permiso «Restringido».
        </li>
        <li>
          En Vercel → Settings → Environment Variables agregá: <code className="rounded bg-surface-muted px-1">GSC_CLIENT_EMAIL</code> (client_email del JSON), <code className="rounded bg-surface-muted px-1">GSC_PRIVATE_KEY</code> (private_key del JSON, completa) y <code className="rounded bg-surface-muted px-1">GSC_SITE_URL</code> = <code className="rounded bg-surface-muted px-1">sc-domain:sologlazes.com.ar</code>. Después hacé Redeploy.
        </li>
      </ol>
      <p className="text-text-secondary">Google tarda unos días en mostrar los primeros datos de una propiedad nueva; los datos de Search Console van con 2–3 días de atraso.</p>
    </div>
  );
}

function Table({ title, rows, label, hint }: { title: string; rows: GscRow[]; label: (r: GscRow) => string; hint?: string }) {
  return (
    <div className="rounded-lg border border-border p-4">
      <h2 className="mb-1 text-h3">{title}</h2>
      {hint && <p className="mb-3 text-xs text-text-secondary">{hint}</p>}
      {rows.length === 0 ? (
        <p className="text-sm text-text-secondary">Sin datos todavía.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="py-1.5 pr-2 font-normal">&nbsp;</th>
                <th className="px-2 py-1.5 text-right font-normal">Clics</th>
                <th className="px-2 py-1.5 text-right font-normal">Impres.</th>
                <th className="px-2 py-1.5 text-right font-normal">CTR</th>
                <th className="py-1.5 pl-2 text-right font-normal">Pos.</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="max-w-[260px] break-words py-1.5 pr-2">{label(r)}</td>
                  <td className="px-2 py-1.5 text-right">{fmt(r.clicks)}</td>
                  <td className="px-2 py-1.5 text-right">{fmt(r.impressions)}</td>
                  <td className="px-2 py-1.5 text-right">{(r.ctr * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 })} %</td>
                  <td className="py-1.5 pl-2 text-right">{r.position.toLocaleString("es-AR", { maximumFractionDigits: 1 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default async function SeoPage() {
  const cfg = gscConfig();

  if (!cfg) {
    return (
      <div>
        <h1 className="mb-2 text-h1">SEO · Google</h1>
        <p className="mb-6 max-w-xl text-text-secondary">Acá vas a ver cómo avanza la indexación y por qué búsquedas aparece el sitio en Google. Falta conectar Search Console.</p>
        <SetupSteps />
      </div>
    );
  }

  // Search Console publica con 2–3 días de atraso.
  const end = Date.now() - 3 * DAY;
  const start = end - 27 * DAY;
  const prevEnd = start - DAY;
  const prevStart = prevEnd - 27 * DAY;
  const cur = { startDate: iso(start), endDate: iso(end) };
  const prev = { startDate: iso(prevStart), endDate: iso(prevEnd) };

  let data: [GscRow[], GscRow[], GscRow[], GscRow[], GscRow[], GscRow[], GscRow[], GscSitemap[]];
  try {
    data = await Promise.all([
      searchAnalytics({ ...cur, rowLimit: 1 }),
      searchAnalytics({ ...prev, rowLimit: 1 }),
      searchAnalytics({ ...cur, dimensions: ["date"], rowLimit: 100 }),
      searchAnalytics({ ...cur, dimensions: ["query"], rowLimit: 30 }),
      searchAnalytics({ ...cur, dimensions: ["page"], rowLimit: 15 }),
      searchAnalytics({ ...cur, dimensions: ["device"], rowLimit: 5 }),
      searchAnalytics({ ...cur, dimensions: ["country"], rowLimit: 6 }),
      listSitemaps().catch(() => [] as GscSitemap[]),
    ]);
  } catch (e) {
    return (
      <div>
        <h1 className="mb-4 text-h1">SEO · Google</h1>
        <div className="max-w-2xl rounded-md border border-[#DC2626]/40 bg-[#DC2626]/5 p-4 text-sm">
          <p className="mb-1 font-medium text-[#DC2626]">No se pudo leer Search Console</p>
          <p className="text-text-secondary">{e instanceof Error ? e.message : String(e)}</p>
          <p className="mt-2 text-text-secondary">Revisá que el email de la cuenta de servicio esté agregado como usuario de la propiedad «{cfg.site}» y que la API de Search Console esté habilitada.</p>
        </div>
      </div>
    );
  }
  const [curTot, prevTot, daily, queries, pages, devices, countries, sitemaps] = data;

  const t = curTot[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0, keys: [] };
  const p = prevTot[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0, keys: [] };
  const kpis = [
    { label: "Impresiones (veces que apareciste)", v: fmt(t.impressions), d: delta(t.impressions, p.impressions) },
    { label: "Clics desde Google", v: fmt(t.clicks), d: delta(t.clicks, p.clicks) },
    { label: "CTR (clics / impresiones)", v: `${(t.ctr * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 })} %`, d: delta(t.ctr, p.ctr) },
    { label: "Posición media", v: t.position ? t.position.toLocaleString("es-AR", { maximumFractionDigits: 1 }) : "—", d: delta(t.position, p.position, true) },
  ];

  const maxImp = Math.max(1, ...daily.map((d) => d.impressions));
  const noData = t.impressions === 0;
  const shortUrl = (u: string) => u.replace(/^https?:\/\/(www\.)?sologlazes\.com\.ar/, "") || "/";

  // Oportunidades: se muestra bastante pero casi no se hace clic, o está al borde de la primera página.
  const opportunities = queries.filter((q) => q.impressions >= 10 && q.position > 5 && q.position <= 20).slice(0, 8);

  return (
    <div>
      <h1 className="mb-1 text-h1">SEO · Google</h1>
      <p className="mb-5 text-sm text-text-secondary">
        Últimos 28 días ({cur.startDate} → {cur.endDate}) contra los 28 anteriores. Fuente: Google Search Console, con 2–3 días de atraso.
      </p>

      {noData && (
        <div className="mb-5 rounded-md bg-surface-muted p-4 text-sm">
          Todavía no hay datos de búsqueda. Es normal en un sitio nuevo o recién conectado: Google tarda días (a veces semanas) en indexar y empezar a mostrar páginas. Usá «Comprobar indexación» abajo para ver en qué punto está cada página.
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-md bg-surface-muted p-4">
            <p className="text-xs text-text-secondary">{k.label}</p>
            <p className="mt-1 text-h2">{k.v}</p>
            {k.d && <p className="text-xs" style={{ color: k.d.up ? "#16A34A" : "#DC2626" }}>{k.d.text} vs. período anterior</p>}
          </div>
        ))}
      </div>

      {daily.length > 0 && (
        <div className="mb-6 rounded-lg border border-border p-4">
          <h2 className="mb-3 text-h3">Impresiones y clics por día</h2>
          <div className="flex h-36 items-end gap-[3px]" role="img" aria-label="Impresiones diarias">
            {daily.map((d) => (
              <div key={d.keys[0]} className="group relative flex h-full flex-1 flex-col justify-end" title={`${d.keys[0]}: ${fmt(d.impressions)} impresiones, ${fmt(d.clicks)} clics`}>
                <div className="w-full rounded-t-[2px] bg-accent/30" style={{ height: `${(d.impressions / maxImp) * 100}%`, minHeight: 2 }}>
                  <div className="w-full rounded-t-[2px] bg-accent" style={{ height: `${d.impressions ? Math.max(8, (d.clicks / d.impressions) * 100) : 0}%`, display: d.clicks ? "block" : "none" }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-secondary">Barra clara: impresiones. Parte oscura: proporción que terminó en clic.</p>
        </div>
      )}

      <section className="mb-6">
        <h2 className="mb-1 text-h2">Progreso de indexación</h2>
        <p className="mb-4 text-sm text-text-secondary">Una página indexada puede aparecer en Google; una pendiente todavía no. Se comprueba cada página de tu sitemap contra Google.</p>
        {sitemaps.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2 text-xs">
            {sitemaps.map((s) => (
              <span key={s.path} className="rounded-[999px] border border-border px-3 py-1 text-text-secondary">
                {shortUrl(s.path)} · leído {s.lastDownloaded ? new Date(s.lastDownloaded).toLocaleDateString("es-AR") : "nunca"}
                {Number(s.errors) > 0 && <span className="text-[#DC2626]"> · {s.errors} errores</span>}
                {Number(s.warnings) > 0 && <span className="text-[#D97706]"> · {s.warnings} avisos</span>}
              </span>
            ))}
          </div>
        )}
        {sitemaps.length === 0 && <p className="mb-4 text-xs text-[#D97706]">No hay sitemaps enviados en Search Console: enviá https://sologlazes.com.ar/sitemap.xml en la sección «Sitemaps».</p>}
        <IndexChecker />
      </section>

      <div className="mb-6 grid gap-4 xl:grid-cols-2">
        <Table title="Búsquedas por las que aparecés" rows={queries} label={(r) => r.keys[0]} hint="Google oculta las búsquedas muy poco frecuentes por privacidad, por eso los totales pueden ser mayores que la suma." />
        <Table title="Páginas que más aparecen" rows={pages} label={(r) => shortUrl(r.keys[0])} />
      </div>

      {opportunities.length > 0 && (
        <div className="mb-6 rounded-lg border border-border p-4">
          <h2 className="mb-1 text-h3">Oportunidades</h2>
          <p className="mb-3 text-xs text-text-secondary">Búsquedas donde ya aparecés entre los puestos 6 y 20: con un poco de contenido o mejores títulos pueden pasar a la primera página.</p>
          <ul className="space-y-1 text-sm">
            {opportunities.map((q) => (
              <li key={q.keys[0]} className="flex justify-between gap-3">
                <span>{q.keys[0]}</span>
                <span className="shrink-0 text-text-secondary">pos. {q.position.toLocaleString("es-AR", { maximumFractionDigits: 1 })} · {fmt(q.impressions)} impr.</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <Table title="Dispositivos" rows={devices} label={(r) => DEVICE[r.keys[0]] ?? r.keys[0]} />
        <Table title="Países" rows={countries} label={(r) => r.keys[0].toUpperCase()} />
      </div>
    </div>
  );
}
