"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email/send";

export type CheckoutInput = {
  name: string;
  email: string;
  phone: string;
  city: string;
  street: string;
  postalCode: string;
  province: string;
  comment?: string;
  shippingLabel: string;
  shippingCost: number;
  paymentProvider: "MERCADO_PAGO" | "MANUAL";
  lines: { slug: string; quantity: number }[];
};

function generateOrderNumber() {
  return `SG-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function createOrderAction(input: CheckoutInput) {
  const session = await auth();

  // Los precios se vuelven a leer desde la base — nunca se confía en el precio que llega del cliente.
  const products = await prisma.product.findMany({
    where: { slug: { in: input.lines.map((l) => l.slug) } },
    include: { variants: true },
  });

  const orderItemsData = input.lines.flatMap((line) => {
    const product = products.find((p) => p.slug === line.slug);
    const variant = product?.variants[0];
    if (!product || !variant) return [];
    return [
      {
        variantId: variant.id,
        productNameSnapshot: product.name,
        variantLabelSnapshot: variant.label,
        unitPriceSnapshot: variant.price,
        quantity: line.quantity,
      },
    ];
  });

  if (orderItemsData.length === 0) {
    throw new Error("No se encontraron productos válidos para este pedido.");
  }

  const subtotal = orderItemsData.reduce((sum, i) => sum + Number(i.unitPriceSnapshot) * i.quantity, 0);
  const total = subtotal + input.shippingCost;

  const address = await prisma.address.create({
    data: {
      userId: session?.user?.id,
      street: input.street,
      number: "",
      city: input.city,
      province: input.province,
      postalCode: input.postalCode,
    },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session?.user?.id,
      status: "PENDING",
      subtotal,
      shippingCost: input.shippingCost,
      total,
      shippingAddressId: address.id,
      customerComment: input.comment,
      paymentProvider: input.paymentProvider,
      paymentStatus: "PENDING",
      items: { create: orderItemsData },
      statusHistory: { create: { status: "PENDING", note: "Pedido creado desde el checkout" } },
    },
  });

  try {
    await sendOrderConfirmationEmail(input.email, {
      orderId: order.orderNumber,
      customerName: input.name,
      total,
    });
    await prisma.emailLog.create({
      data: { orderId: order.id, type: "ORDER_CONFIRMATION", recipient: input.email, status: "SENT" },
    });
  } catch {
    // No bloqueamos el checkout si falla el email — se registra para reintentar/alertar
    await prisma.emailLog.create({
      data: { orderId: order.id, type: "ORDER_CONFIRMATION", recipient: input.email, status: "FAILED" },
    });
  }

  return { orderNumber: order.orderNumber };
}
