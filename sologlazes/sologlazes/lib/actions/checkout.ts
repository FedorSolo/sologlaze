"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendOrderConfirmationEmail, sendAdminNewOrderEmail } from "@/lib/email/send";
import { mpClient } from "@/lib/mercadopago";
import { Preference } from "mercadopago";
import { reserveStock, OutOfStockError } from "@/lib/stock";

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
  lines: { variantId: string; quantity: number; note?: string }[];
};

export type CheckoutResult =
  | { ok: false; error: string }
  | { ok: true; orderNumber: string; orderId: string; mpCheckoutUrl?: string };

function generateOrderNumber() {
  return `SG-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function createOrderAction(input: CheckoutInput): Promise<CheckoutResult> {
  const session = await auth();

  // Los precios se vuelven a leer desde la base — nunca se confía en el precio que llega del cliente.
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
  const total = subtotal + input.shippingCost;

  const contactNote = `Nombre: ${input.name} · Tel: ${input.phone} · Email: ${input.email}`;
  const packNotes = input.lines
    .filter((l) => l.note)
    .map((l) => {
      const variant = variants.find((v) => v.id === l.variantId);
      return `${variant?.product.name ?? "Pack"}: ${l.note!.split("|").join(", ")}`;
    })
    .join("\n");
  const fullComment = [contactNote, packNotes, input.comment].filter(Boolean).join("\n\n");
  const labels = Object.fromEntries(variants.map((v) => [v.id, `${v.product.name} (${v.label})`]));

  // Stock + dirección + pedido en UNA transacción: si falta stock no queda nada a medias.
  let order;
  try {
    order = await prisma.$transaction(async (tx) => {
      await reserveStock(tx, orderItemsData, labels);

      const address = await tx.address.create({
        data: {
          userId: session?.user?.id,
          street: input.street,
          number: "",
          city: input.city,
          province: input.province,
          postalCode: input.postalCode,
        },
      });

      return tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.user?.id,
          status: "PENDING",
          subtotal,
          shippingCost: input.shippingCost,
          total,
          shippingAddressId: address.id,
          customerComment: fullComment,
          trackingCarrier: input.shippingLabel,
          paymentProvider: input.paymentProvider,
          paymentStatus: "PENDING",
          items: { create: orderItemsData },
          statusHistory: { create: { status: "PENDING", note: "Pedido creado desde el checkout" } },
        },
      });
    });
  } catch (err) {
    if (err instanceof OutOfStockError) return { ok: false, error: `${err.message} Actualizá tu carrito e intentá de nuevo.` };
    throw err;
  }

  try {
    await sendOrderConfirmationEmail(input.email, {
      orderId: order.orderNumber,
      customerName: input.name,
      total,
      items: orderItemsData.map((i) => ({
        name: i.productNameSnapshot,
        variantLabel: i.variantLabelSnapshot ?? undefined,
        quantity: i.quantity,
        price: Number(i.unitPriceSnapshot),
      })),
      address: { street: input.street, city: input.city, province: input.province, postalCode: input.postalCode },
      shippingLabel: input.shippingLabel,
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

  try {
    await sendAdminNewOrderEmail({
      orderId: order.orderNumber,
      total,
      customerName: input.name,
      customerPhone: input.phone,
    });
  } catch {
    // No bloqueamos el checkout si falla la notificación al admin
  }

  let mpCheckoutUrl: string | undefined;
  if (input.paymentProvider === "MERCADO_PAGO" && process.env.MERCADOPAGO_ACCESS_TOKEN) {
    try {
      const preference = new Preference(mpClient);
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sologlazes.com.ar";
      const result = await preference.create({
        body: {
          items: orderItemsData.map((i) => ({
            id: i.variantId,
            title: `${i.productNameSnapshot} (${i.variantLabelSnapshot ?? ""})`,
            quantity: i.quantity,
            unit_price: Number(i.unitPriceSnapshot),
            currency_id: "ARS",
          })),
          shipments: input.shippingCost > 0 ? { cost: input.shippingCost, mode: "not_specified" } : undefined,
          external_reference: order.id,
          back_urls: {
            success: `${baseUrl}/checkout/confirmacion/${order.id}`,
            pending: `${baseUrl}/checkout/confirmacion/${order.id}`,
            failure: `${baseUrl}/checkout/confirmacion/${order.id}`,
          },
          auto_return: "approved",
          notification_url: `${baseUrl}/api/webhooks/mercadopago`,
          payer: { name: input.name, email: input.email },
        },
      });
      mpCheckoutUrl = result.init_point ?? undefined;
    } catch (err) {
      // Si falla la creación de la preferencia, el pedido queda igual creado (PENDING) —
      // el cliente puede coordinar el pago por WhatsApp como respaldo.
      console.error("Error creando preferencia de Mercado Pago:", err);
    }
  }

  return { ok: true, orderNumber: order.orderNumber, orderId: order.id, mpCheckoutUrl };
}
