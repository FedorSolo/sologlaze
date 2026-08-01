import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { getOrderByNumber, toOrderView } from "@/lib/queries/orders";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { RepeatOrderButton } from "@/components/account/repeat-order-button";
import { Truck } from "lucide-react";

export default async function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect(`/ingresar?callbackUrl=/cuenta/pedidos/${params.orderId}`);

  const raw = await getOrderByNumber(params.orderId);
  if (!raw || raw.userId !== session.user.id) notFound();

  const order = toOrderView(raw);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-h2">Pedido {order.id}</h2>
          <p className="text-sm text-text-secondary">
            {new Date(order.date).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.trackingNumber && (
        <div className="mb-6 flex items-center justify-between rounded-md border border-border bg-surface-muted p-4">
          <div className="flex items-center gap-3 text-sm">
            <Truck size={18} className="text-text-secondary" />
            <div>
              <p className="font-medium">{order.trackingCarrier}</p>
              <p className="text-text-secondary">{order.trackingNumber}</p>
            </div>
          </div>
          {/* v1: enlace a la página del transportista con el número de trackeo (ver PRD, Out of scope: sin integración de API) */}
          <a
            href={`https://www.correoargentino.com.ar/seguimiento?numero=${order.trackingNumber}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border-strong px-4 py-2 text-sm"
          >
            Rastrear envío
          </a>
        </div>
      )}

      <div className="mb-6 divide-y divide-border rounded-lg border border-border">
        {order.items.map((item) => (
          <div key={item.slug} className="flex items-center gap-4 p-4">
            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-surface-muted">
              <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium">{item.name}</p>
              <p className="text-text-secondary">Cantidad: {item.quantity}</p>
            </div>
            <span className="text-sm font-medium">$ {(item.price * item.quantity).toLocaleString("es-AR")}</span>
          </div>
        ))}
        <div className="flex justify-between p-4 text-sm font-medium">
          <span>Total</span>
          <span>$ {order.total.toLocaleString("es-AR")} ARS</span>
        </div>
      </div>

      <RepeatOrderButton order={order} />
    </div>
  );
}
