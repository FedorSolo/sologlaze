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

function parseImageUrls(formData: FormData): string[] {
  const raw = String(formData.get("images") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === "string" && u.length > 0) : [];
  } catch {
    return [];
  }
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
  const images = parseImageUrls(formData);
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();

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
      images: images.length
        ? { create: images.map((url, i) => ({ url, alt: name, sortOrder: i })) }
        : undefined,
      videos: videoUrl ? { create: [{ url: videoUrl, alt: name, sortOrder: 0 }] } : undefined,
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

export type UpdateProductState = { error?: string; success?: boolean };

export async function updateProductAction(
  productId: string,
  _prevState: UpdateProductState,
  formData: FormData
): Promise<UpdateProductState> {
  const name = String(formData.get("name") ?? "").trim();
  const collectionId = String(formData.get("collectionId") ?? "");
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const applicationInstructions = String(formData.get("applicationInstructions") ?? "").trim();
  const price = Number(formData.get("price"));
  const isActive = formData.get("isActive") === "on";
  const inStock = formData.get("inStock") === "on";
  const images = parseImageUrls(formData);
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();

  if (!name || !collectionId || !shortDescription || !description || !price || price <= 0) {
    return { error: "Completá al menos nombre, serie, descripciones y un precio válido." };
  }

  const product = await prisma.product.update({
    where: { id: productId },
    data: { name, collectionId, shortDescription, description, applicationInstructions, basePrice: price, isActive },
    include: { variants: { include: { inventory: true } } },
  });

  // Actualiza precio/stock de la primera variante (esquema simple de 1 variante por producto en el admin).
  const variant = product.variants[0];
  if (variant) {
    await prisma.productVariant.update({ where: { id: variant.id }, data: { price } });
    await prisma.inventory.upsert({
      where: { variantId: variant.id },
      update: { status: inStock ? "IN_STOCK" : "OUT_OF_STOCK" },
      create: { variantId: variant.id, quantity: inStock ? 25 : 0, status: inStock ? "IN_STOCK" : "OUT_OF_STOCK" },
    });
  }

  // Reemplaza todas las fotos por la lista actual (más simple y predecible que hacer diff).
  await prisma.productImage.deleteMany({ where: { productId } });
  if (images.length) {
    await prisma.productImage.createMany({
      data: images.map((url, i) => ({ productId, url, alt: name, sortOrder: i })),
    });
  }

  // Mismo criterio para el video — como máximo uno por producto en el admin.
  await prisma.productVideo.deleteMany({ where: { productId } });
  if (videoUrl) {
    await prisma.productVideo.create({ data: { productId, url: videoUrl, alt: name, sortOrder: 0 } });
  }

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${product.slug}`);
  return { success: true };
}
