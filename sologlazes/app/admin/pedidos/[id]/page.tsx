import { notFound } from "next/navigation";
import { getOrderById, toOrderView } from "@/lib/queries/orders";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";

const statuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const raw = await getOrderById(params.id);
  if (!raw) notFound();
  const order = toOrderView(raw);

  return (
    <form action={updateOrderStatusAction} className="max-w-lg">
      <h1 className="mb-6 text-h1">Pedido {order.id}</h1>
      <input type="hidden" name="orderId" value={order.dbId} />

      <label className="mb-4 block text-sm">
        <span className="mb-1 block text-text-secondary">Estado</span>
        <select name="status" defaultValue={order.status} className="h-11 w-full rounded-sm border border-border px-3">
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className="mb-4 block text-sm">
        <span className="mb-1 block text-text-secondary">Transportista</span>
        <input name="trackingCarrier" defaultValue={order.trackingCarrier} className="h-11 w-full rounded-sm border border-border px-3" />
      </label>

      <label className="mb-6 block text-sm">
        <span className="mb-1 block text-text-secondary">Número de trackeo</span>
        <input name="trackingNumber" defaultValue={order.trackingNumber} className="h-11 w-full rounded-sm border border-border px-3" />
      </label>

      <button type="submit" className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
        Guardar y notificar al cliente
      </button>
      <p className="mt-2 text-xs text-text-secondary">
        Al guardar como SHIPPED se dispara automáticamente el email ORDER_SHIPPED al cliente.
      </p>
    </form>
  );
}
