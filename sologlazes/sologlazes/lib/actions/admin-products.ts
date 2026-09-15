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
  const isActive = formData.get("isActive") === "on";
  const images = parseImageUrls(formData);
  const videoUrl = String(formData.get("videoUrl") ?? "").trim();

  const variantCount = Number(formData.get("variantCount") ?? 0);
  const variantUpdates: { id: string; price: number; compareAtPrice: number | null; stockQuantity: number }[] = [];
  for (let i = 0; i < variantCount; i++) {
    const id = String(formData.get(`variantId_${i}`) ?? "");
    const vPrice = Number(formData.get(`variantPrice_${i}`));
    const vCompareRaw = String(formData.get(`variantCompareAtPrice_${i}`) ?? "").trim();
    const vCompare = vCompareRaw ? Number(vCompareRaw) : null;
    const vStock = Math.max(0, Number(formData.get(`variantStock_${i}`) ?? 0));
    if (id && Number.isFinite(vPrice) && vPrice > 0) {
      variantUpdates.push({
        id,
        price: vPrice,
        compareAtPrice: vCompare && vCompare > vPrice ? vCompare : null,
        stockQuantity: vStock,
      });
    }
  }

  if (!name || !collectionId || !shortDescription || !description || variantUpdates.length === 0) {
    return { error: "Completá al menos nombre, serie, descripciones y un precio válido por cada presentación." };
  }

  const basePrice = variantUpdates[0].price;

  const product = await prisma.product.update({
    where: { id: productId },
    data: { name, collectionId, shortDescription, description, applicationInstructions, basePrice, isActive },
  });

  for (const v of variantUpdates) {
    await prisma.productVariant.update({
      where: { id: v.id },
      data: { price: v.price, compareAtPrice: v.compareAtPrice },
    });
    await prisma.inventory.upsert({
      where: { variantId: v.id },
      update: { quantity: v.stockQuantity, status: v.stockQuantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK" },
      create: { variantId: v.id, quantity: v.stockQuantity, status: v.stockQuantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK" },
    });
  }

  await prisma.productImage.deleteMany({ where: { productId } });
  if (images.length) {
    await prisma.productImage.createMany({
      data: images.map((url, i) => ({ productId, url, alt: name, sortOrder: i })),
    });
  }

  await prisma.productVideo.deleteMany({ where: { productId } });
  if (videoUrl) {
    await prisma.productVideo.create({ data: { productId, url: videoUrl, alt: name, sortOrder: 0 } });
  }

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${product.slug}`);
  return { success: true };
}

// Edición rápida desde la tabla de /admin/productos — un peso a la vez, sin abrir el formulario completo.
export async function quickUpdatePriceStock(variantId: string, price: number, stockQuantity: number) { e8af46dd73ea17eff775b21834f716bcb7d1437a
export async function quickUpdatePriceStock(variantId: string, price: number, stockQuantity: number) {
  if (!Number.isFinite(price) || price <= 0) throw new Error("Precio inválido");
  if (!Number.isFinite(stockQuantity) || stockQuantity < 0) throw new Error("Stock inválido");

  const variant = await prisma.productVariant.findUnique({ where: { id: variantId }, include: { product: true } });
  if (!variant) throw new Error("Presentación no encontrada");

  await prisma.productVariant.update({ where: { id: variantId }, data: { price } });
  await prisma.inventory.upsert({
    where: { variantId },
    update: { quantity: stockQuantity, status: stockQuantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK" },
    create: { variantId, quantity: stockQuantity, status: stockQuantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK" },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  revalidatePath(`/producto/${variant.product.slug}`);
}
