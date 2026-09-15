"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type CreateCollectionState = { error?: string; success?: boolean };

export async function createCollectionAction(
  _prevState: CreateCollectionState,
  formData: FormData
): Promise<CreateCollectionState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const heroImageUrl = String(formData.get("heroImageUrl") ?? "").trim();

  if (!name || !description) {
    return { error: "Completá al menos el nombre y la descripción." };
  }

  const slug = slugify(name);
  const existing = await prisma.collection.findUnique({ where: { slug } });
  if (existing) {
    return { error: `Ya existe una categoría con el slug "${slug}".` };
  }

  const maxSort = await prisma.collection.aggregate({ _max: { sortOrder: true } });

  await prisma.collection.create({
    data: {
      slug,
      name,
      description,
      heroImageUrl: heroImageUrl || "/images/hero.jpg",
      sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
    },
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/catalogo");
  revalidatePath("/");
  return { success: true };
}
