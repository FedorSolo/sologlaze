import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { mpClient } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";

// Mercado Pago llama a esta URL automáticamente cuando cambia el estado de un pago.
// Configurar notification_url ya la manda automáticamente la preferencia creada en checkout.ts,
// pero además hay que configurar esta URL como "Webhook" en el panel de MP para eventos futuros
// (reembolsos, contracargos, etc.): https://www.mercadopago.com.ar/developers/panel/app → Webhooks.
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // MP manda distintos formatos según el evento — nos interesa "payment".
    const paymentId = body?.data?.id ?? body?.id;
    const type = body?.type ?? body?.topic;
    if (type !== "payment" || !paymentId) {
      return NextResponse.json({ received: true });
    }

    const payment = new Payment(mpClient);
    const paymentInfo = await payment.get({ id: paymentId });

    const orderId = paymentInfo.external_reference;
    if (!orderId) return NextResponse.json({ received: true });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return NextResponse.json({ received: true });

    const statusMap: Record<string, "PAID" | "PENDING" | "FAILED" | "REFUNDED"> = {
      approved: "PAID",
      pending: "PENDING",
      in_process: "PENDING",
      rejected: "FAILED",
      cancelled: "FAILED",
      refunded: "REFUNDED",
      charged_back: "REFUNDED",
    };
    const newStatus = statusMap[paymentInfo.status ?? ""] ?? "PENDING";

    if (newStatus !== order.paymentStatus) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: newStatus,
          status: newStatus === "PAID" ? "PAID" : order.status,
        },
      });
      await prisma.orderStatusHistory.create({
        data: {
          orderId,
          status: newStatus === "PAID" ? "PAID" : order.status,
          note: `Mercado Pago: pago ${paymentInfo.status} (id ${paymentId})`,
        },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error en webhook de Mercado Pago:", error);
    // Devolvemos 200 igual — si devolvemos error, MP reintenta indefinidamente.
    return NextResponse.json({ received: true, error: true });
  }
}
