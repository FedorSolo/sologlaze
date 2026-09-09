import { prisma } from "@/lib/prisma";

export default async function AdminEstadisticasPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [ordersThisMonth, allOrdersCount, pendingCount, itemsGrouped, statusGrouped] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "PAID", "PROCESSING"] } } }),
    prisma.orderItem.groupBy({
      by: ["productNameSnapshot"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
  ]);

  const salesThisMonth = ordersThisMonth.reduce((sum, o) => sum + Number(o.total), 0);
  const avgTicket = ordersThisMonth.length > 0 ? salesThisMonth / ordersThisMonth.length : 0;

  const metrics = [
    { label: "Ventas del mes", value: `$ ${salesThisMonth.toLocaleString("es-AR")}` },
    { label: "Pedidos pendientes", value: String(pendingCount) },
    { label: "Pedidos totales", value: String(allOrdersCount) },
    { label: "Ticket promedio (mes)", value: `$ ${avgTicket.toLocaleString("es-AR", { maximumFractionDigits: 0 })}` },
  ];

  return (
    <div>
      <h1 className="mb-6 text-h1">Estadísticas</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-md bg-surface-muted p-4">
            <p className="mb-1 text-xs text-text-secondary">{m.label}</p>
            <p className="text-h2">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-h3">Más vendidos</h2>
          {itemsGrouped.length === 0 ? (
            <p className="text-sm text-text-secondary">Todavía no hay ventas registradas.</p>
          ) : (
            <div className="divide-y divide-border rounded-lg border border-border">
              {itemsGrouped.map((g) => (
                <div key={g.productNameSnapshot} className="flex justify-between p-3 text-sm">
                  <span>{g.productNameSnapshot}</span>
                  <span className="text-text-secondary">{g._sum.quantity} unid.</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-h3">Pedidos por estado</h2>
          <div className="divide-y divide-border rounded-lg border border-border">
            {statusGrouped.map((g) => (
              <div key={g.status} className="flex justify-between p-3 text-sm">
                <span>{g.status}</span>
                <span className="text-text-secondary">{g._count.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-text-secondary">
        Conversión (sesión → pedido) y Core Web Vitals requieren analytics conectado (ver PRD sección 8) —
        todavía no hay proveedor de analytics integrado en este scaffold.
      </p>
    </div>
  );
}
