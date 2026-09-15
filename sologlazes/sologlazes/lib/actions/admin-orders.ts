"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from "@/lib/email/send";

const VALID_STATUSES = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("orderId"));
  const status = String(formData.get("status"));
  const trackingCarrier = String(formData.get("trackingCarrier") ?? "");
  const trackingNumber = String(formData.get("trackingNumber") ?? "");

  if (!VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    throw new Error("Estado de pedido inválido");
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as (typeof VALID_STATUSES)[number],
      trackingCarrier: trackingCarrier || null,
      trackingNumber: trackingNumber || null,
      statusHistory: { create: { status: status as (typeof VALID_STATUSES)[number] } },
    },
    include: { user: true },
  });

  if (status === "SHIPPED" && order.user?.email) {
    try {
      await sendOrderShippedEmail(order.user.email, {
        orderId: order.orderNumber,
        customerName: order.user.name ?? "",
        total: Number(order.total),
        trackingCarrier: order.trackingCarrier ?? undefined,
        trackingNumber: order.trackingNumber ?? undefined,
      });
      await prisma.emailLog.create({
        data: { orderId: order.id, type: "ORDER_SHIPPED", recipient: order.user.email, status: "SENT" },
      });
    } catch {
      await prisma.emailLog.create({
        data: { orderId: order.id, type: "ORDER_SHIPPED", recipient: order.user.email, status: "FAILED" },
      });
    }
  }

  if (status === "DELIVERED" && order.user?.email) {
    try {
      await sendOrderDeliveredEmail(order.user.email, {
        orderId: order.orderNumber,
        customerName: order.user.name ?? "",
        total: Number(order.total),
      });
      await prisma.emailLog.create({
        data: { orderId: order.id, type: "ORDER_DELIVERED", recipient: order.user.email, status: "SENT" },
      });
    } catch {
      await prisma.emailLog.create({
        data: { orderId: order.id, type: "ORDER_DELIVERED", recipient: order.user.email, status: "FAILED" },
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
