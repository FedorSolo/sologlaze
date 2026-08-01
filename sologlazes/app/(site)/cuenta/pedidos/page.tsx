import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrdersForUser, toOrderView } from "@/lib/queries/orders";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

export default async function PedidosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/ingresar?callbackUrl=/cuenta/pedidos");

  const orders = (await getOrdersForUser(session.user.id)).map(toOrderView);

  if (orders.length === 0) {
    return <p className="text-sm text-text-secondary">Todavía no hiciste ningún pedido.</p>;
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/cuenta/pedidos/${order.id}`}
          className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-surface-muted"
        >
          <div>
            <p className="text-sm font-medium">Pedido {order.id}</p>
            <p className="text-sm text-text-secondary">
              {new Date(order.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
              {order.items.length} producto{order.items.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">$ {order.total.toLocaleString("es-AR")}</span>
            <OrderStatusBadge status={order.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
