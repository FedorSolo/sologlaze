import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TZ = "America/Argentina/Buenos_Aires";
const DAY = 24 * 60 * 60 * 1000;
const PERIODS = [
  { key: "hoy", label: "Hoy", days: 1 },
  { key: "7", label: "7 días", days: 7 },
  { key: "30", label: "30 días", days: 30 },
  { key: "90", label: "90 días", days: 90 },
];

const EVENT_LABELS: Record<string, string> = {
  add_to_cart: "Agregados al carrito",
  purchase: "Pedidos realizados",
  whatsapp_click: "Clics en WhatsApp",
  ml_click: "Clics en Mercado Libre",
  instagram_click: "Clics en Instagram",
};

const n = (v: unknown) => Number(v ?? 0);
const fmt = (v: number) => v.toLocaleString("es-AR");
const pct = (a: number, b: number) => (b > 0 ? `${((a / b) * 100).toLocaleString("es-AR", { maximumFractionDigits: 1 })} %` : "—");

function delta(cur: number, prev: number) {
  if (prev === 0) return cur > 0 ? { text: "nuevo", up: true } : null;
  const d = ((cur - prev) / prev) * 100;
  return { text: `${d >= 0 ? "▲" : "▼"} ${Math.abs(d).toLocaleString("es-AR", { maximumFractionDigits: 0 })} %`, up: d >= 0 };
}

// Argentina no tiene horario de verano: medianoche local = 03:00 UTC.
function startOfTodayAR() {
  const local = new Date(Date.now() - 3 * 60 * 60 * 1000);
  return Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate(), 3);
}

type Row = Record<string, unknown>;

export default async function AnaliticaPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const { p } = await searchParams;
  const period = PERIODS.find((x) => x.key === p) ?? PERIODS[1];

  const to = new Date(startOfTodayAR() + DAY);
  const from = new Date(to.getTime() - period.days * DAY);
  const prevFrom = new Date(from.getTime() - period.days * DAY);
  const live = new Date(Date.now() - 5 * 60 * 1000);

  const range = Prisma.sql`"createdAt" >= ${from} AND "createdAt" < ${to}`;
  const q = (sql: Prisma.Sql) => prisma.$queryRaw<Row[]>(sql);

  let data;
  try {
    data = await Promise.all([
      q(Prisma.sql`SELECT COUNT(DISTINCT "visitorId") AS visitors, COUNT(DISTINCT "sessionId") AS sessions, COUNT(*) FILTER (WHERE type = 'pageview') AS pageviews FROM "AnalyticsEvent" WHERE ${range}`),
      q(Prisma.sql`SELECT COUNT(DISTINCT "visitorId") AS visitors, COUNT(DISTINCT "sessionId") AS sessions, COUNT(*) FILTER (WHERE type = 'pageview') AS pageviews FROM "AnalyticsEvent" WHERE "createdAt" >= ${prevFrom} AND "createdAt" < ${from}`),
      q(Prisma.sql`SELECT name, COUNT(*) AS c, COUNT(DISTINCT "sessionId") AS s, COALESCE(SUM(value), 0) AS v FROM "AnalyticsEvent" WHERE type = 'event' AND ${range} GROUP BY name`),
      q(Prisma.sql`SELECT to_char(("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${TZ}, 'YYYY-MM-DD') AS d, COUNT(DISTINCT "visitorId") AS visitors, COUNT(*) FILTER (WHERE type = 'pageview') AS pageviews FROM "AnalyticsEvent" WHERE ${range} GROUP BY 1 ORDER BY 1`),
      q(Prisma.sql`SELECT path, COUNT(*) AS views, COUNT(DISTINCT "visitorId") AS visitors FROM "AnalyticsEvent" WHERE type = 'pageview' AND ${range} GROUP BY path ORDER BY views DESC LIMIT 10`),
      q(Prisma.sql`SELECT COALESCE(source, 'Directo') AS k, COUNT(DISTINCT "sessionId") AS c FROM "AnalyticsEvent" WHERE ${range} GROUP BY 1 ORDER BY c DESC LIMIT 8`),
      q(Prisma.sql`SELECT COALESCE(device, 'Otro') AS k, COUNT(DISTINCT "sessionId") AS c FROM "AnalyticsEvent" WHERE ${range} GROUP BY 1 ORDER BY c DESC`),
      q(Prisma.sql`SELECT COALESCE(country, '—') AS k, COUNT(DISTINCT "sessionId") AS c FROM "AnalyticsEvent" WHERE ${range} GROUP BY 1 ORDER BY c DESC LIMIT 6`),
      q(Prisma.sql`SELECT COALESCE(city, '—') AS k, COUNT(DISTINCT "sessionId") AS c FROM "AnalyticsEvent" WHERE ${range} AND city IS NOT NULL GROUP BY 1 ORDER BY c DESC LIMIT 6`),
      q(Prisma.sql`SELECT
        COUNT(DISTINCT "sessionId") FILTER (WHERE type = 'pageview' AND path LIKE '/producto/%') AS product,
        COUNT(DISTINCT "sessionId") FILTER (WHERE name = 'add_to_cart') AS cart,
        COUNT(DISTINCT "sessionId") FILTER (WHERE type = 'pageview' AND path = '/carrito') AS viewcart,
        COUNT(DISTINCT "sessionId") FILTER (WHERE type = 'pageview' AND path = '/checkout') AS checkout,
        COUNT(DISTINCT "sessionId") FILTER (WHERE name = 'purchase') AS purchase
        FROM "AnalyticsEvent" WHERE ${range}`),
      q(Prisma.sql`SELECT path AS k, COUNT(*) AS c FROM "AnalyticsEvent" WHERE type = 'pageview' AND path LIKE '/producto/%' AND ${range} GROUP BY path ORDER BY c DESC LIMIT 8`),
      q(Prisma.sql`SELECT label AS k, COUNT(*) AS c FROM "AnalyticsEvent" WHERE name = 'add_to_cart' AND label IS NOT NULL AND ${range} GROUP BY label ORDER BY c DESC LIMIT 8`),
      q(Prisma.sql`SELECT COALESCE(browser, 'Otro') AS k, COUNT(DISTINCT "sessionId") AS c FROM "AnalyticsEvent" WHERE ${range} GROUP BY 1 ORDER BY c DESC LIMIT 6`),
      q(Prisma.sql`SELECT COUNT(DISTINCT "visitorId") AS c FROM "AnalyticsEvent" WHERE "createdAt" >= ${live}`),
    ]);
  } catch {
    return (
      <div>
        <h1 className="mb-4 text-h1">Analítica</h1>
        <div className="rounded-md bg-surface-muted p-5 text-sm">
          <p className="mb-2 font-medium">Falta crear la tabla de analítica.</p>
          <p className="text-text-secondary">
            Ejecutá una sola vez el archivo <code>add-analytics.sql</code> en Supabase → SQL Editor → Run, y recargá esta página.
          </p>
        </div>
      </div>
    );
  }

  const [kpiR, prevR, eventsR, dailyR, pagesR, sourcesR, devicesR, countriesR, citiesR, funnelR, prodViewsR, prodCartR, browsersR, liveR] = data;
  const kpi = kpiR[0] ?? {};
  const prev = prevR[0] ?? {};
  const visitors = n(kpi.visitors);
  const sessions = n(kpi.sessions);
  const pageviews = n(kpi.pageviews);

  const ev: Record<string, { c: number; s: number; v: number }> = {};
  for (const r of eventsR) ev[String(r.name)] = { c: n(r.c), s: n(r.s), v: n(r.v) };

  // Días sin visitas también aparecen (en cero) para que el gráfico no tenga huecos.
  const byDay = new Map(dailyR.map((r) => [String(r.d), { visitors: n(r.visitors), pageviews: n(r.pageviews) }]));
  const days: { d: string; visitors: number; pageviews: number }[] = [];
  for (let i = 0; i < period.days; i++) {
    const t = new Date(from.getTime() + i * DAY - 3 * 60 * 60 * 1000);
    const d = t.toISOString().slice(0, 10);
    days.push({ d, ...(byDay.get(d) ?? { visitors: 0, pageviews: 0 }) });
  }
  const maxVisitors = Math.max(1, ...days.map((x) => x.visitors));

  const f = funnelR[0] ?? {};
  const funnel = [
    { label: "Sesiones", value: sessions },
    { label: "Vieron un producto", value: n(f.product) },
    { label: "Agregaron al carrito", value: n(f.cart) },
    { label: "Abrieron el checkout", value: n(f.checkout) },
    { label: "Hicieron un pedido", value: n(f.purchase) },
  ];

  const cards = [
    { label: "Visitantes", value: fmt(visitors), d: delta(visitors, n(prev.visitors)) },
    { label: "Sesiones", value: fmt(sessions), d: delta(sessions, n(prev.sessions)) },
    { label: "Páginas vistas", value: fmt(pageviews), d: delta(pageviews, n(prev.pageviews)) },
    { label: "Páginas por sesión", value: sessions ? (pageviews / sessions).toLocaleString("es-AR", { maximumFractionDigits: 1 }) : "—", d: null },
    { label: "Pedidos", value: fmt(ev.purchase?.c ?? 0), d: null },
    { label: "Conversión a pedido", value: pct(n(f.purchase), sessions), d: null },
  ];

  const slugName = (path: string) => path.replace("/producto/", "");
  const peopleNow = n(liveR[0]?.c);

  const List = ({ title, rows, suffix }: { title: string; rows: { k: string; c: number }[]; suffix?: string }) => {
    const max = Math.max(1, ...rows.map((r) => r.c));
    return (
      <div>
        <h2 className="mb-3 text-h3">{title}</h2>
        {rows.length === 0 ? (
          <p className="text-sm text-text-secondary">Sin datos todavía.</p>
        ) : (
          <div className="divide-y divide-border rounded-lg border border-border">
            {rows.map((r) => (
              <div key={r.k} className="relative p-3 text-sm">
                <div className="absolute inset-y-0 left-0 bg-surface-muted" style={{ width: `${(r.c / max) * 100}%` }} />
                <div className="relative flex justify-between gap-3">
                  <span className="min-w-0 truncate">{r.k}</span>
                  <span className="shrink-0 text-text-secondary">{fmt(r.c)}{suffix}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const toRows = (rs: Row[]) => rs.map((r) => ({ k: String(r.k), c: n(r.c) }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h1">Analítica</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-[50%] bg-status-success align-middle" />
            {peopleNow} en el sitio ahora
          </span>
          <div className="flex gap-1">
            {PERIODS.map((x) => (
              <Link
                key={x.key}
                href={`/admin/analitica?p=${x.key}`}
                className={`rounded-md px-3 py-1.5 text-sm ${x.key === period.key ? "bg-accent-soft text-accent" : "text-text-secondary hover:bg-surface-muted"}`}
              >
                {x.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-md bg-surface-muted p-4">
            <p className="mb-1 text-xs text-text-secondary">{c.label}</p>
            <p className="text-h2">{c.value}</p>
            {c.d && <p className={`mt-1 text-xs ${c.d.up ? "text-status-success" : "text-status-error"}`}>{c.d.text} vs. período anterior</p>}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-h3">Visitantes por día</h2>
        <div className="rounded-lg border border-border p-4">
          <div className="flex h-40 items-end gap-px">
            {days.map((x) => (
              <div key={x.d} className="group relative flex h-full min-w-0 flex-1 items-end" title={`${x.d}: ${x.visitors} visitantes · ${x.pageviews} páginas`}>
                <div className="w-full bg-text-primary transition-colors group-hover:bg-text-secondary" style={{ height: `${Math.max(2, (x.visitors / maxVisitors) * 100)}%`, opacity: x.visitors ? 1 : 0.15 }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-text-secondary">
            <span>{days[0]?.d}</span>
            <span>máx. {maxVisitors} por día</span>
            <span>{days[days.length - 1]?.d}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-h3">Embudo de compra (sesiones)</h2>
          <div className="divide-y divide-border rounded-lg border border-border">
            {funnel.map((s, i) => (
              <div key={s.label} className="relative p-3 text-sm">
                <div className="absolute inset-y-0 left-0 bg-surface-muted" style={{ width: `${funnel[0].value ? (s.value / funnel[0].value) * 100 : 0}%` }} />
                <div className="relative flex justify-between gap-3">
                  <span>{s.label}</span>
                  <span className="text-text-secondary">
                    {fmt(s.value)}
                    {i > 0 && <span className="ml-2 text-xs">({pct(s.value, funnel[0].value)})</span>}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-secondary">Cada paso cuenta sesiones distintas que llegaron a esa etapa.</p>
        </div>

        <div>
          <h2 className="mb-3 text-h3">Acciones</h2>
          <div className="divide-y divide-border rounded-lg border border-border">
            {Object.keys(EVENT_LABELS).map((k) => (
              <div key={k} className="flex justify-between p-3 text-sm">
                <span>{EVENT_LABELS[k]}</span>
                <span className="text-text-secondary">
                  {fmt(ev[k]?.c ?? 0)}
                  {k === "purchase" && ev[k] ? <span className="ml-2 text-xs">$ {fmt(ev[k].v)}</span> : null}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-text-secondary">Los montos son los del pedido al hacerlo; las ventas confirmadas están en Estadísticas.</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-h3">Páginas más vistas</h2>
          {pagesR.length === 0 ? (
            <p className="text-sm text-text-secondary">Sin datos todavía.</p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {pagesR.map((r) => (
                <div key={String(r.path)} className="flex justify-between gap-3 p-3 text-sm">
                  <span className="min-w-0 truncate">{String(r.path)}</span>
                  <span className="shrink-0 text-text-secondary">{fmt(n(r.views))} · {fmt(n(r.visitors))} vis.</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <List title="De dónde llegan (sesiones)" rows={toRows(sourcesR)} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <List title="Productos más vistos" rows={prodViewsR.map((r) => ({ k: slugName(String(r.k)), c: n(r.c) }))} />
        <List title="Productos más agregados al carrito" rows={toRows(prodCartR)} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <List title="Dispositivo" rows={toRows(devicesR)} />
        <List title="Navegador" rows={toRows(browsersR)} />
        <List title="País" rows={toRows(countriesR)} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <List title="Ciudad" rows={toRows(citiesR)} />
      </div>

      <p className="mt-8 text-xs text-text-secondary">
        Sin cookies ni IP: cada navegador recibe un id anónimo. Tus propias visitas (cuando entrás al panel) y los robots no se cuentan. Fechas en hora de Buenos Aires.
      </p>
    </div>
  );
}
