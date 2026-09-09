import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderById, toOrderView } from "@/lib/queries/orders";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

const statuses = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await getOrderById(id);
  if (!raw) notFound();
  const order = toOrderView(raw);

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h1">Pedido {order.id}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          {/* Productos */}
          <section>
            <h2 className="mb-3 text-h3">Productos</h2>
            <div className="divide-y divide-border rounded-lg border border-border">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-text-secondary">
                      {item.variantLabel ? `${item.variantLabel} · ` : ""}Cantidad: {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">$ {(item.price * item.quantity).toLocaleString("es-AR")}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>$ {order.subtotal.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Envío</span>
                <span>$ {order.shippingCost.toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>$ {order.total.toLocaleString("es-AR")}</span>
              </div>
            </div>
          </section>

          {/* Cliente y contacto */}
          <section>
            <h2 className="mb-3 text-h3">Cliente</h2>
            <div className="rounded-lg border border-border p-4 text-sm">
              {order.customerName && <p><strong>{order.customerName}</strong></p>}
              {order.customerEmail && <p className="text-text-secondary">{order.customerEmail}</p>}
              {order.customerPhone && <p className="text-text-secondary">{order.customerPhone}</p>}
              {order.customerComment && (
                <p className="mt-2 whitespace-pre-line border-t border-border pt-2 text-text-secondary">
                  {order.customerComment}
                </p>
              )}
              {!order.customerName && !order.customerComment && (
                <p className="text-text-secondary">Sin datos de contacto adicionales.</p>
              )}
            </div>
          </section>

          {/* Dirección y envío */}
          {order.address && (
            <section>
              <h2 className="mb-3 text-h3">Dirección de envío</h2>
              <div className="rounded-lg border border-border p-4 text-sm text-text-secondary">
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.province} — CP {order.address.postalCode}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Gestión */}
        <aside className="h-fit rounded-lg border border-border p-4">
          <form action={updateOrderStatusAction} className="space-y-4">
            <input type="hidden" name="orderId" value={order.dbId} />

            <label className="block text-sm">
              <span className="mb-1 block text-text-secondary">Estado</span>
              <select name="status" defaultValue={order.status} className="h-11 w-full rounded-sm border border-border px-3">
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-text-secondary">Método / transportista</span>
              <input name="trackingCarrier" defaultValue={order.trackingCarrier} className="h-11 w-full rounded-sm border border-border px-3" />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-text-secondary">Número de trackeo</span>
              <input name="trackingNumber" defaultValue={order.trackingNumber} className="h-11 w-full rounded-sm border border-border px-3" />
            </label>

            <div className="border-t border-border pt-3 text-sm text-text-secondary">
              <p>Pago: {order.paymentProvider}</p>
              <p>Estado de pago: {order.paymentStatus}</p>
            </div>

            <button type="submit" className="w-full rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
              Guardar y notificar
            </button>
            <p className="text-xs text-text-secondary">
              Al guardar como SHIPPED o DELIVERED se dispara automáticamente el email correspondiente.
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
}
