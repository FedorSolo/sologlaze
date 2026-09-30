"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendAdminNewOrderEmail } from "@/lib/email/send";
import { reserveStock, OutOfStockError } from "@/lib/stock";

export type QuickOrderInput = {
  phone: string;
  lines: { variantId: string; quantity: number; note?: string }[];
};

export type QuickOrderResult =
  | { ok: false; error: string }
  | { ok: true; orderNumber: string; whatsappUrl: string };

function generateOrderNumber() {
  return `SG-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function createQuickOrderAction(input: QuickOrderInput): Promise<QuickOrderResult> {
  const session = await auth();

  // Precios siempre desde la base de datos.
  // Cada línea es una presentación concreta (peso) identificada por variantId.
  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: input.lines.map((l) => l.variantId) },
      product: { isActive: true, deletedAt: null },
    },
    include: { product: true, inventory: true },
  });

  const soldOut: string[] = [];
  const orderItemsData = input.lines.flatMap((line) => {
    const variant = variants.find((v) => v.id === line.variantId);
    if (!variant) return [];
    if (variant.inventory?.status === "OUT_OF_STOCK") {
      soldOut.push(`${variant.product.name} (${variant.label})`);
      return [];
    }
    const quantity = Math.min(200, Math.max(1, Math.floor(Number(line.quantity) || 1)));
    return [
      {
        variantId: variant.id,
        productNameSnapshot: variant.product.name,
        variantLabelSnapshot: variant.label,
        unitPriceSnapshot: variant.price,
        quantity,
      },
    ];
  });

  if (soldOut.length > 0) {
    return { ok: false, error: `Sin stock por el momento: ${soldOut.join(", ")}. Quitalo del carrito para continuar.` };
  }
  if (orderItemsData.length === 0) {
    return { ok: false, error: "No se encontraron productos válidos para este pedido. Revisá tu carrito." };
  }

  const subtotal = orderItemsData.reduce((sum, i) => sum + Number(i.unitPriceSnapshot) * i.quantity, 0);

  const labels = Object.fromEntries(variants.map((v) => [v.id, `${v.product.name} (${v.label})`]));

  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      await reserveStock(tx, orderItemsData, labels);

      // Pedido rápido: todavía no hay dirección — se completa cuando el vendedor contacta al cliente por WhatsApp.
      const address = await tx.address.create({
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

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.user?.id,
          status: "PENDING",
          subtotal,
          shippingCost: 0,
          total: subtotal,
          shippingAddressId: address.id,
          customerComment: [
            `⚡ PEDIDO RÁPIDO — contactar por WhatsApp: ${input.phone}`,
            ...input.lines
              .filter((l) => l.note)
              .map((l) => {
                const variant = variants.find((v) => v.id === l.variantId);
                return `${variant?.product.name ?? "Pack"}: ${l.note!.split("|").join(", ")}`;
              }),
          ].join("\n"),
          paymentProvider: "MANUAL",
          paymentStatus: "PENDING",
          items: { create: orderItemsData },
          statusHistory: { create: { status: "PENDING", note: "Pedido rápido creado — pendiente de contacto por WhatsApp" } },
        },
      });
    });
  } catch (err) {
    if (err instanceof OutOfStockError) return { ok: false, error: `${err.message} Actualizá tu carrito e intentá de nuevo.` };
    throw err;
  }

  const itemsText = orderItemsData
    .map((i) => `• ${i.productNameSnapshot} (${i.variantLabelSnapshot}) x${i.quantity}`)
    .join("\n");
  const waMessage = `Hola! Quiero hacer el pedido ${order.orderNumber}:\n${itemsText}\nTotal: $${subtotal.toLocaleString("es-AR")}\nMi WhatsApp: ${input.phone}`;
  const whatsappUrl = `https://wa.me/5491127379589?text=${encodeURIComponent(waMessage)}`;

  try {
    await sendAdminNewOrderEmail({
      orderId: order.orderNumber,
      total: subtotal,
      customerName: "Pedido rápido",
      customerPhone: input.phone,
      isQuickOrder: true,
    });
  } catch {
    // No bloqueamos el flujo si falla la notificación
  }

  return { ok: true, orderNumber: order.orderNumber, whatsappUrl };
}
