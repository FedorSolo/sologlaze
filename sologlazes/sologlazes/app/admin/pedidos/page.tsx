import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllOrders, toOrderView } from "@/lib/queries/orders";
import { StatusPill } from "@/components/admin/status-pill";
import { ORDER_STATUS, ORDER_STATUS_ORDER } from "@/lib/admin-order-status";
import { parseOrderComment } from "@/lib/order-comment";
import { OrdersList } from "@/components/admin/orders-list";
import { trashedOrderIds } from "@/lib/order-trash";

export const dynamic = "force-dynamic";

const TZ = "America/Argentina/Buenos_Aires";

export default async function AdminPedidosPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  const [rawOrders, trashed] = await Promise.all([getAllOrders(), trashedOrderIds()]);
  const everything = rawOrders.map((raw) => {
    const v = toOrderView(raw);
    const c = parseOrderComment(raw.customerComment);
    // Cuenta registrada primero; si compró como invitado, los datos salen del texto del pedido.
    return { ...v, name: v.customerName ?? c.name, email: v.customerEmail ?? c.email, phone: v.customerPhone ?? c.phone };
  });

  // Los pedidos en la papelera no se cuentan ni se muestran en los demás filtros.
  const all = everything.filter((o) => !trashed.has(o.dbId));
  const trash = everything.filter((o) => trashed.has(o.dbId));

  const counts: Record<string, number> = {};
  for (const o of all) counts[o.status] = (counts[o.status] ?? 0) + 1;

  const active = s === "TRASH" ? "TRASH" : s && ORDER_STATUS[s] ? s : "ALL";
  const orders = active === "TRASH" ? trash : active === "ALL" ? all : all.filter((o) => o.status === active);

  const tabs = [
    { key: "ALL", label: "Todos", count: all.length, color: "#1C1717" },
    ...ORDER_STATUS_ORDER.filter((k) => counts[k]).map((k) => ({ key: k, label: ORDER_STATUS[k].label, count: counts[k], color: ORDER_STATUS[k].color })),
    ...(trash.length ? [{ key: "TRASH", label: "🗑 Papelera", count: trash.length, color: "#6B6461" }] : []),
  ];

  return (
    <div>
      <h1 className="mb-4 text-h1">Pedidos</h1>

      {/* Filtros por estado */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <Link
              key={t.key}
              href={t.key === "ALL" ? "/admin/pedidos" : `/admin/pedidos?s=${t.key}`}
              className="inline-flex items-center gap-2 rounded-[999px] border px-3.5 py-1.5 text-sm transition-colors"
              style={on ? { background: t.color, borderColor: t.color, color: "#fff" } : { borderColor: `${t.color}55`, color: t.color }}
            >
              {t.label}
              <span className="rounded-[999px] px-1.5 text-xs" style={on ? { background: "rgba(255,255,255,0.25)" } : { background: `${t.color}18` }}>{t.count}</span>
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-text-secondary">{active === "TRASH" ? "La papelera está vacía." : all.length === 0 ? "Todavía no hay pedidos." : "No hay pedidos con este estado."}</p>
      ) : (
        <OrdersList
          trash={active === "TRASH"}
          rows={orders.map((o) => {
            const st = ORDER_STATUS[o.status] ?? ORDER_STATUS.PENDING;
            const date = new Date(o.date);
            const first = o.items[0];
            const more = o.items.length - 1;
            const cancelled = o.status === "CANCELLED" || o.status === "REFUNDED";
            const node = (
              <Link
                href={`/admin/pedidos/${o.dbId}`}
                className="group grid items-start gap-x-5 gap-y-3 rounded-lg border border-border p-4 transition-shadow hover:shadow-md md:grid-cols-2 xl:grid-cols-[130px_1.2fr_1.2fr_1fr_130px_16px]"
                style={{ borderLeft: `6px solid ${st.color}`, background: st.tint, opacity: cancelled ? 0.8 : 1 }}
              >
                {/* Pedido + estado */}
                <div className="flex items-start justify-between gap-3 md:col-span-2 xl:col-span-1 xl:block">
                  <div>
                    <p className="font-medium">{o.id}</p>
                    <p className="text-xs text-text-secondary">
                      {date.toLocaleDateString("es-AR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" })} ·{" "}
                      {date.toLocaleTimeString("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="xl:hidden">
                    <StatusPill status={o.status} />
                  </div>
                </div>

                {/* Cliente */}
                <div className="min-w-0 text-sm">
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-text-secondary">Cliente</p>
                  <p className="break-words font-medium">{o.name ?? "Sin nombre"}</p>
                  <p className="break-all text-text-secondary">{o.phone ?? "Sin teléfono"}</p>
                  <p className="break-all text-text-secondary">{o.email ?? "Sin email"}</p>
                </div>

                {/* Dirección */}
                <div className="min-w-0 text-sm">
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-text-secondary">Dirección</p>
                  {o.address ? (
                    <>
                      <p className="break-words font-medium">{o.address.street}</p>
                      <p className="text-text-secondary">{o.address.city}, {o.address.province}</p>
                      <p className="text-text-secondary">CP {o.address.postalCode}</p>
                    </>
                  ) : (
                    <p className="text-text-secondary">Sin dirección</p>
                  )}
                </div>

                {/* Productos y total */}
                <div className="min-w-0 text-sm">
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-text-secondary">Pedido</p>
                  <p className="break-words text-text-secondary">
                    {first ? `${first.name}${first.variantLabel ? ` (${first.variantLabel})` : ""} × ${first.quantity}` : "—"}
                  </p>
                  {more > 0 && <p className="text-xs text-text-secondary">y {more} producto{more > 1 ? "s" : ""} más</p>}
                  <p className={`mt-1 font-medium ${cancelled ? "line-through" : ""}`}>$ {o.total.toLocaleString("es-AR")}</p>
                </div>

                {/* Estado (escritorio ancho) */}
                <div className="hidden xl:block xl:justify-self-end">
                  <StatusPill status={o.status} />
                </div>
                <ChevronRight size={16} className="hidden self-center text-text-secondary transition-transform group-hover:translate-x-0.5 xl:block" />
              </Link>
            );
            return { id: o.dbId, label: o.id, node };
          })}
        />
      )}
    </div>
  );
}
