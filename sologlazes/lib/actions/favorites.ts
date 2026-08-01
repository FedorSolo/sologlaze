"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function toggleFavoriteAction(productSlug: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Necesitás iniciar sesión para guardar favoritos.");
  }

  const product = await prisma.product.findUnique({ where: { slug: productSlug } });
  if (!product) return;

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId: session.user.id, productId: product.id } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: session.user.id, productId: product.id } });
  }

  revalidatePath("/cuenta/favoritos");
}
