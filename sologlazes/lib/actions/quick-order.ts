"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type QuickOrderInput = {
  phone: string;
  lines: { slug: string; quantity: number }[];
};

function generateOrderNumber() {
  return `SG-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function createQuickOrderAction(input: QuickOrderInput) {
  const session = await auth();

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

  // Pedido rápido: todavía no hay dirección — se completa cuando el vendedor contacta al cliente por WhatsApp.
  const address = await prisma.address.create({
    data: {
      userId: session?.user?.id,
      label: "Pedido rápido — a confirmar por WhatsApp",
      street: "A confirmar",
      number: "",
      city: "A confirmar",
      province: "A confirmar",
      postalCode: "-",
    },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId: session?.user?.id,
      status: "PENDING",
      subtotal,
      shippingCost: 0,
      total: subtotal,
      shippingAddressId: address.id,
      customerComment: `⚡ PEDIDO RÁPIDO — contactar por WhatsApp: ${input.phone}`,
      paymentProvider: "MANUAL",
      paymentStatus: "PENDING",
      items: { create: orderItemsData },
      statusHistory: { create: { status: "PENDING", note: "Pedido rápido creado — pendiente de contacto por WhatsApp" } },
    },
  });

  const itemsText = orderItemsData
    .map((i) => `• ${i.productNameSnapshot} (${i.variantLabelSnapshot}) x${i.quantity}`)
    .join("%0A");
  const waMessage = `Hola! Quiero hacer el pedido ${order.orderNumber}:%0A${itemsText}%0ATotal: $${subtotal.toLocaleString("es-AR")}%0AMi WhatsApp: ${input.phone}`;
  const whatsappUrl = `https://wa.me/5491127379589?text=${waMessage}`;

  return { orderNumber: order.orderNumber, whatsappUrl };
}
