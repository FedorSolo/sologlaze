import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [pendingOrders, totalProducts, pendingReviews] = await Promise.all([
    prisma.order.count({ where: { status: { in: ["PENDING", "PAID", "PROCESSING"] } } }),
    prisma.product.count({ where: { isActive: true, deletedAt: null } }),
    prisma.review.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-h1">Panel</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Link href="/admin/pedidos" className="rounded-md bg-surface-muted p-4 transition-colors hover:bg-accent-soft">
          <p className="mb-1 text-xs text-text-secondary">Pedidos pendientes</p>
          <p className="text-h2">{pendingOrders}</p>
        </Link>
        <Link href="/admin/productos" className="rounded-md bg-surface-muted p-4 transition-colors hover:bg-accent-soft">
          <p className="mb-1 text-xs text-text-secondary">Productos activos</p>
          <p className="text-h2">{totalProducts}</p>
        </Link>
        <Link href="/admin/resenas" className="rounded-md bg-surface-muted p-4 transition-colors hover:bg-accent-soft">
          <p className="mb-1 text-xs text-text-secondary">Reseñas por moderar</p>
          <p className="text-h2">{pendingReviews}</p>
        </Link>
      </div>
      <p className="mt-6 text-sm">
        Ver más detalle en <Link href="/admin/estadisticas" className="text-accent">Estadísticas</Link>.
      </p>
    </div>
  );
}
