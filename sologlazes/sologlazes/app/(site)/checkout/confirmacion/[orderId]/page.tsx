import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Estado de tu pedido", robots: { index: false } };

type Params = { params: Promise<{ orderId: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function OrderConfirmationPage({ params, searchParams }: Params) {
  const { orderId } = await params;
  const query = await searchParams;

  // Puede llegar el número (SG-123456) o el id interno (cuando se vuelve desde Mercado Pago).
  const order = await prisma.order.findFirst({
    where: { OR: [{ id: orderId }, { orderNumber: orderId }] },
    select: { id: true, orderNumber: true, userId: true, paymentProvider: true, paymentStatus: true },
  });
  const session = await auth();

  const orderNumber = order?.orderNumber ?? orderId;
  const isOwner = !!order?.userId && order.userId === session?.user?.id;

  // Mercado Pago vuelve con ?status=approved|pending|rejected — solo se usa como pista si la base aún no se actualizó.
  const mpHint = String(query.status ?? query.collection_status ?? "");
  const paymentStatus = order?.paymentStatus ?? "PENDING";
  const isMercadoPago = order?.paymentProvider === "MERCADO_PAGO";

  let state: "paid" | "pending" | "failed" | "manual" = "manual";
  if (isMercadoPago) {
    if (paymentStatus === "PAID" || mpHint === "approved") state = "paid";
    else if (paymentStatus === "FAILED" || mpHint === "rejected" || mpHint === "failure" || mpHint === "cancelled") state = "failed";
    else state = "pending";
  }

  const waText = encodeURIComponent(`Hola! Te escribo por mi pedido ${orderNumber}.`);
  const content = {
    paid: {
      icon: <CheckCircle2 size={40} className="text-status-success" />,
      title: "¡Pago recibido, gracias!",
      text: "Ya estamos preparando tu pedido. Te enviamos un email de confirmación y te avisamos cuando salga.",
    },
    pending: {
      icon: <Clock size={40} className="text-status-warning" />,
      title: "Estamos esperando la acreditación del pago",
      text: "Mercado Pago todavía no nos confirmó el pago. Apenas se acredite, tu pedido pasa a preparación. Te enviamos un email con el detalle.",
    },
    failed: {
      icon: <AlertCircle size={40} className="text-status-error" />,
      title: "El pago no se completó",
      text: "Tu pedido quedó registrado, pero el pago no se realizó. Escribinos por WhatsApp y lo resolvemos juntos — podés pagar de nuevo, por transferencia o en efectivo.",
    },
    manual: {
      icon: <CheckCircle2 size={40} className="text-status-success" />,
      title: "¡Pedido recibido!",
      text: "Te contactamos por WhatsApp o email para coordinar el pago y el envío. Te enviamos un email con el detalle de tu pedido.",
    },
  }[state];

  return (
    <div className="container flex flex-col items-center gap-4 py-16 text-center lg:py-24">
      {content.icon}
      <h1 className="max-w-md text-h1">{content.title}</h1>
      <p className="text-text-secondary">
        Número de pedido <span className="font-medium text-text-primary">{orderNumber}</span>
      </p>
      <p className="max-w-md text-sm text-text-secondary">{content.text}</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a
          href={`https://wa.me/5491127379589?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm ${
            state === "failed" || state === "manual" ? "bg-accent text-white" : "border border-border-strong"
          }`}
        >
          <MessageCircle size={16} /> Escribir por WhatsApp
        </a>
        {isOwner && (
          <Link href={`/cuenta/pedidos/${orderNumber}`} className="rounded-full border border-border-strong px-6 py-3 text-sm">
            Ver mi pedido
          </Link>
        )}
        <Link href="/catalogo" className="rounded-full border border-border-strong px-6 py-3 text-sm">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
