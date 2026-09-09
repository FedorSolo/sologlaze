import Link from "next/link";
import { getAllOrders, toOrderView } from "@/lib/queries/orders";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

export default async function AdminPedidosPage() {
  const orders = (await getAllOrders()).map(toOrderView);

  return (
    <div>
      <h1 className="mb-6 text-h1">Pedidos</h1>
      {orders.length === 0 ? (
        <p className="text-sm text-text-secondary">Todavía no hay pedidos.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-text-secondary">
            <tr>
              <th className="py-2 font-medium">Pedido</th>
              <th className="py-2 font-medium">Fecha</th>
              <th className="py-2 font-medium">Total</th>
              <th className="py-2 font-medium">Estado</th>
              <th className="py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.dbId}>
                <td className="py-3 font-medium">{o.id}</td>
                <td className="py-3 text-text-secondary">{new Date(o.date).toLocaleDateString("es-AR")}</td>
                <td className="py-3">$ {o.total.toLocaleString("es-AR")}</td>
                <td className="py-3"><OrderStatusBadge status={o.status} /></td>
                <td className="py-3 text-right">
                  <Link href={`/admin/pedidos/${o.dbId}`} className="text-accent">Gestionar</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
