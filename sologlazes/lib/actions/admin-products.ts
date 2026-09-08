"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type CreateProductState = { error?: string };

export async function createProductAction(
  _prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> {
  const name = String(formData.get("name") ?? "").trim();
  const collectionId = String(formData.get("collectionId") ?? "");
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const applicationInstructions = String(formData.get("applicationInstructions") ?? "").trim();
  const variantLabel = String(formData.get("variantLabel") ?? "0.5 kg").trim();
  const price = Number(formData.get("price"));
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const imageAlt = String(formData.get("imageAlt") ?? name).trim();

  if (!name || !collectionId || !shortDescription || !description || !price || price <= 0) {
    return { error: "Completá al menos nombre, serie, descripciones y un precio válido." };
  }

  const slug = slugify(name);

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return { error: `Ya existe un producto con el slug "${slug}". Elegí un nombre distinto.` };
  }

  const product = await prisma.product.create({
    data: {
      slug,
      collectionId,
      name,
      shortDescription,
      description,
      applicationInstructions: applicationInstructions || "Aplicar sobre bizcocho poroso. Cocción a 1200 °C (cono 5,5).",
      basePrice: price,
      isActive: true,
      images: imageUrl ? { create: [{ url: imageUrl, alt: imageAlt || name, sortOrder: 0 }] } : undefined,
    },
  });

  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      sku: `${slug}-0`,
      label: variantLabel,
      price,
    },
  });

  await prisma.inventory.create({
    data: { variantId: variant.id, quantity: 25, status: "IN_STOCK" },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  redirect("/admin/productos");
}
