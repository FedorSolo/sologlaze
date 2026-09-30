"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from "@/lib/email/send";
import { reserveStock, restoreStock, OutOfStockError } from "@/lib/stock";

const VALID_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("orderId"));
  const status = String(formData.get("status"));
  const trackingCarrier = String(formData.get("trackingCarrier") ?? "");
  const trackingNumber = String(formData.get("trackingNumber") ?? "");

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Estado de pedido inválido");
  }

  const previous = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { variant: { include: { product: true } } } } },
  });
  if (!previous) throw new Error("Pedido no encontrado");

  const newStatus = status as (typeof VALID_STATUSES)[number];
  const wasCancelled = previous.status === "CANCELLED";
  const willBeCancelled = newStatus === "CANCELLED";

  const order = await prisma.$transaction(async (tx) => {
    // Cancelar un pedido devuelve las unidades al stock; reactivarlo las vuelve a descontar.
    if (!wasCancelled && willBeCancelled) {
      await restoreStock(tx, previous.items);
    } else if (wasCancelled && !willBeCancelled) {
      const labels = Object.fromEntries(
        previous.items.filter((i) => i.variantId).map((i) => [i.variantId as string, i.productNameSnapshot])
      );
      await reserveStock(tx, previous.items, labels);
    }

    return tx.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        trackingCarrier: trackingCarrier || null,
        trackingNumber: trackingNumber || null,
        statusHistory: { create: { status: newStatus } },
      },
      include: { user: true },
    });
  }).catch((err) => {
    if (err instanceof OutOfStockError) {
      throw new Error(`No se puede reactivar el pedido: ${err.message}`);
    }
    throw err;
  });

  // Los pedidos de invitados (sin cuenta) guardan el email dentro del comentario del pedido.
  const emailFromComment = order.customerComment?.match(/Email:\s*([^\s·]+@[^\s·]+)/)?.[1];
  const nameFromComment = order.customerComment?.match(/Nombre:\s*([^·\n]+?)\s*(?:·|$|\n)/)?.[1]?.trim();
  const customerEmail = order.user?.email ?? emailFromComment;
  const customerName = order.user?.name ?? nameFromComment ?? "";

  if (status === "SHIPPED" && customerEmail) {
    try {
      await sendOrderShippedEmail(customerEmail, {
        orderId: order.orderNumber,
        customerName,
        total: Number(order.total),
        trackingCarrier: order.trackingCarrier ?? undefined,
        trackingNumber: order.trackingNumber ?? undefined,
      });
      await prisma.emailLog.create({
        data: { orderId: order.id, type: "ORDER_SHIPPED", recipient: customerEmail, status: "SENT" },
      });
    } catch {
      await prisma.emailLog.create({
        data: { orderId: order.id, type: "ORDER_SHIPPED", recipient: customerEmail, status: "FAILED" },
      });
    }
  }

  if (status === "DELIVERED" && customerEmail) {
    try {
      await sendOrderDeliveredEmail(customerEmail, {
        orderId: order.orderNumber,
        customerName,
        total: Number(order.total),
      });
      await prisma.emailLog.create({
        data: { orderId: order.id, type: "ORDER_DELIVERED", recipient: customerEmail, status: "SENT" },
      });
    } catch {
      await prisma.emailLog.create({
        data: { orderId: order.id, type: "ORDER_DELIVERED", recipient: customerEmail, status: "FAILED" },
      });
    }
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath("/admin/pedidos");
}

export async function moderateReviewAction(reviewId: string, status: "APPROVED" | "REJECTED") {
  await prisma.review.update({ where: { id: reviewId }, data: { status } });
  revalidatePath("/admin/resenas");
}

export type CreateReviewState = { error?: string; success?: boolean };

export async function adminCreateReviewAction(
  _prevState: CreateReviewState,
  formData: FormData
): Promise<CreateReviewState> {
  const productSlug = String(formData.get("productSlug") ?? "");
  const authorName = String(formData.get("authorName") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!productSlug || !rating || rating < 1 || rating > 5 || !comment) {
    return { error: "Completá producto, calificación y comentario." };
  }

  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) return { error: `No existe ningún producto con el slug "${productSlug}".` };

  await prisma.review.create({
    data: {
      productId: product.id,
      rating,
      comment: authorName ? `${comment} — ${authorName}` : comment,
      status: "APPROVED", // cargada por el admin, se publica directo
    },
  });

  revalidatePath("/admin/resenas");
  revalidatePath(`/producto/${productSlug}`);
  return { success: true };
}
