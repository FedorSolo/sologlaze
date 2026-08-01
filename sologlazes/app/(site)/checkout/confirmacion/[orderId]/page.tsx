import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="container flex flex-col items-center gap-4 py-24 text-center">
      <CheckCircle2 size={40} className="text-status-success" />
      <h1 className="text-h1">¡Pedido confirmado!</h1>
      <p className="text-text-secondary">
        Número de pedido <span className="font-medium text-text-primary">{params.orderId}</span>
      </p>
      <p className="max-w-sm text-sm text-text-secondary">
        Te enviamos un email de confirmación. Podés seguir el estado desde tu cuenta.
      </p>
      <div className="mt-4 flex gap-3">
        <Link href={`/cuenta/pedidos/${params.orderId}`} className="rounded-full bg-accent px-6 py-3 text-sm text-white">
          Ver mi pedido
        </Link>
        <Link href="/catalogo" className="rounded-full border border-border-strong px-6 py-3 text-sm">
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
