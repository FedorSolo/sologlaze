"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type SubmitReviewState = { error?: string; success?: boolean };

export async function submitReviewAction(
  _prevState: SubmitReviewState,
  formData: FormData
): Promise<SubmitReviewState> {
  const productSlug = String(formData.get("productSlug") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!productSlug || !rating || rating < 1 || rating > 5 || !comment) {
    return { error: "Completá una calificación (1 a 5) y un comentario." };
  }

  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) return { error: "Producto no encontrado." };

  const session = await auth();

  await prisma.review.create({
    data: {
      productId: product.id,
      userId: session?.user?.id ?? null,
      rating,
      comment,
      status: "PENDING", // un admin lo aprueba antes de que se vea públicamente
    },
  });

  revalidatePath(`/producto/${productSlug}`);
  revalidatePath("/admin/resenas");
  return { success: true };
}
