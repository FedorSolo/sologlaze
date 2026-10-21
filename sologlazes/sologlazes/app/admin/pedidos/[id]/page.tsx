import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getOrderById, toOrderView } from "@/lib/queries/orders";
import { updateOrderStatusAction } from "@/lib/actions/admin-orders";
import { StatusPill } from "@/components/admin/status-pill";
import { ORDER_STATUS, ORDER_STATUS_ORDER, PAYMENT_PROVIDER_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/admin-order-status";
import { parseOrderComment, whatsappNumber } from "@/lib/order-comment";

const TZ = "America/Argentina/Buenos_Aires";
const money = (v: number) => `$ ${v.toLocaleString("es-AR")}`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 py-2.5 text-sm sm:grid-cols-[130px_1fr]">
      <dt className="text-text-secondary">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border">
      <h2 className="border-b border-border bg-surface-muted px-4 py-2.5 text-sm font-medium">{title}</h2>
      <div className="px-4 py-1">{children}</div>
    </section>
  );
}

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await getOrderById(id);
  if (!raw) notFound();
  const order = toOrderView(raw);
  const parsed = parseOrderComment(order.customerComment);

  // El contacto sale de la cuenta (si compró logueado) o del texto del pedido (invitado).
  const name = order.customerName ?? parsed.name;
  const email = order.customerEmail ?? parsed.email;
  const phone = order.customerPhone ?? parsed.phone;
  const wa = whatsappNumber(phone);
  const status = ORDER_STATUS[order.status] ?? ORDER_STATUS.PENDING;
  const date = new Date(order.date);
  const mapQuery = order.address ? `${order.address.street}, ${order.address.city}, ${order.address.province}` : "";

  return (
    <div className="max-w-6xl">
      <Link href="/admin/pedidos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft size={14} /> Todos los pedidos
      </Link>

      {/* Encabezado con el color del estado */}
      <div className="mb-6 rounded-lg border border-border p-4 sm:p-5" style={{ borderLeft: `6px solid ${status.color}`, background: status.tint }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-h1">Pedido {order.id}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              {date.toLocaleDateString("es-AR", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" })} ·{" "}
              {date.toLocaleTimeString("es-AR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" })} hs
            </p>
          </div>
          <div className="text-right">
            <StatusPill status={order.status} large />
            <p className="mt-1 text-xs text-text-secondary">{status.hint}</p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-black/10 pt-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs text-text-secondary">Total</dt>
            <dd className="text-h3">{money(order.total)}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-secondary">Pago</dt>
            <dd>
              {PAYMENT_PROVIDER_LABEL[order.paymentProvider] ?? order.paymentProvider} ·{" "}
              <span className="font-medium">{PAYMENT_STATUS_LABEL[order.paymentStatus] ?? order.paymentStatus}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-secondary">Entrega</dt>
            <dd>{order.trackingCarrier || "Sin definir"}</dd>
          </div>
          <div>
            <dt className="text-xs text-text-secondary">Seguimiento</dt>
            <dd>{order.trackingNumber || "—"}</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          {/* Cliente y entrega, lado a lado */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card title="Cliente">
              <dl className="divide-y divide-border">
                <Field label="Nombre">{name ? <strong className="font-medium">{name}</strong> : <span className="text-text-secondary">—</span>}</Field>
                <Field label="Teléfono">
                  {phone ? (
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <a href={`tel:${phone}`} className="inline-flex items-center gap-1.5 hover:underline">
                        <Phone size={13} /> {phone}
                      </a>
                      {wa && (
                        <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:underline">
                          <MessageCircle size={13} /> WhatsApp
                        </a>
                      )}
                    </span>
                  ) : (
                    <span className="text-text-secondary">—</span>
                  )}
                </Field>
                <Field label="Email">
                  {email ? (
                    <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 break-all hover:underline">
                      <Mail size={13} className="shrink-0" /> {email}
                    </a>
                  ) : (
                    <span className="text-text-secondary">—</span>
                  )}
                </Field>
                <Field label="Cuenta">{order.customerName || raw.userId ? "Cliente registrado" : "Compra como invitado"}</Field>
              </dl>
              {parsed.quickOrder && (
                <p className="mb-3 rounded-md bg-surface-muted p-3 text-xs text-text-secondary">
                  ⚡ Pedido rápido: se creó sin pasar por el checkout. Hay que contactar al cliente por WhatsApp para coordinar el pago y el envío.
                </p>
              )}
            </Card>

            <Card title="Dirección de envío">
              {order.address ? (
                <>
                  <dl className="divide-y divide-border">
                    <Field label="Calle y número"><strong className="font-medium">{order.address.street}</strong></Field>
                    <Field label="Localidad">{order.address.city}</Field>
                    <Field label="Provincia">{order.address.province}</Field>
                    <Field label="Código postal">{order.address.postalCode}</Field>
                  </dl>
                  <div className="pb-3 pt-1">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[999px] border border-border-strong px-3 py-1.5 text-xs hover:bg-surface-muted"
                    >
                      <MapPin size={14} /> Ver en el mapa
                    </a>
                  </div>
                </>
              ) : (
                <p className="py-3 text-sm text-text-secondary">Sin dirección cargada (retiro o pedido rápido).</p>
              )}
            </Card>
          </div>

          {/* Productos */}
          <Card title={`Productos (${order.items.reduce((s, i) => s + i.quantity, 0)})`}>
            <div className="divide-y divide-border">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-text-secondary">
                      {item.variantLabel ? `${item.variantLabel} · ` : ""}
                      {money(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{money(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-1 border-t border-border py-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{money(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Envío</span>
                <span>{money(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between pt-1 text-base font-medium">
                <span>Total</span>
                <span>{money(order.total)}</span>
              </div>
            </div>
          </Card>

          {/* Glaseados elegidos en el pack */}
          {parsed.packs.map((pack, pi) => (
            <Card key={pi} title={`Glaseados elegidos — ${pack.product}`}>
              <ol className="divide-y divide-border">
                {pack.picks.map((p, i) => (
                  <li key={i} className="flex items-center gap-3 py-2.5 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[50%] bg-surface-muted text-xs text-text-secondary">{i + 1}</span>
                    <span className="font-medium">{p.name}</span>
                    {p.series && <span className="text-text-secondary">· {p.series}</span>}
                  </li>
                ))}
              </ol>
            </Card>
          ))}

          {/* Notas del cliente / avisos */}
          {parsed.notes.length > 0 && (
            <Card title="Notas del pedido">
              <div className="space-y-2 py-3 text-sm">
                {parsed.notes.map((n, i) => (
                  <p key={i} className="whitespace-pre-line">{n}</p>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Gestión */}
        <aside className="h-fit rounded-lg border border-border xl:sticky xl:top-4">
          <h2 className="border-b border-border bg-surface-muted px-4 py-2.5 text-sm font-medium">Gestionar pedido</h2>
          <form action={updateOrderStatusAction} className="space-y-4 p-4">
            <input type="hidden" name="orderId" value={order.dbId} />

            <label className="block text-sm">
              <span className="mb-1 block text-text-secondary">Estado</span>
              <select name="status" defaultValue={order.status} className="h-11 w-full rounded-sm border border-border px-3">
                {ORDER_STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>{ORDER_STATUS[s].label}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-text-secondary">Método de envío</span>
              <select name="trackingCarrier" defaultValue={order.trackingCarrier} className="h-11 w-full rounded-sm border border-border px-3">
                <option value="">Sin definir</option>
                <option value="Retiro en el taller">Retiro en el taller (self pickup)</option>
                <option value="Mensajería propia en CABA">Mensajería propia en CABA</option>
                <option value="Correo Argentino">Correo Argentino</option>
                <option value="Andreani">Andreani</option>
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block text-text-secondary">Número de seguimiento</span>
              <input name="trackingNumber" defaultValue={order.trackingNumber} className="h-11 w-full rounded-sm border border-border px-3" />
            </label>

            <button type="submit" className="w-full rounded-[999px] bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent-hover">
              Guardar y notificar
            </button>
            <p className="text-xs text-text-secondary">
              Al guardar como «Enviado» o «Entregado» se manda automáticamente el email al cliente. Si lo pasás a «Cancelado», el stock vuelve al inventario.
            </p>
          </form>
        </aside>
      </div>
    </div>
  );
}
