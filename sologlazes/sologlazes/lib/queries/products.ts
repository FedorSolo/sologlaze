import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { ProductCardData } from "@/components/shop/product-card";
import { localizeTemp, tr, type Lang } from "@/lib/i18n-dict";
import { collectionName, getProductTranslations, type ProductTr } from "@/lib/translations";

// Selección compartida: trae justo lo necesario para tarjeta de catálogo + atributos de filtro.
const cardInclude = {
  collection: { select: { slug: true, name: true } },
  images: { orderBy: { sortOrder: "asc" as const }, take: 2 },
  attributeValues: { include: { attributeValue: { include: { attribute: true } } } },
  variants: { include: { inventory: true }, orderBy: { price: "asc" as const } }, // sin take: para poder mostrar precio de cada peso en la tarjeta
} satisfies Prisma.ProductInclude;

type ProductWithCardRelations = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

function attrValue(product: { attributeValues: { attributeValue: { attribute: { key: string }; value: string } }[] }, key: string) {
  return product.attributeValues.find((av) => av.attributeValue.attribute.key === key)?.attributeValue.value ?? "—";
}

function toCard(
  product: ProductWithCardRelations,
  lang: Lang = "es",
  trans?: ProductTr
): ProductCardData & {
  temperature: string;
} {
  const name = trans?.name ?? product.name;
  const temp = localizeTemp(attrValue(product, "temperature"), lang);
  const inventory = product.variants[0]?.inventory;
  const price = product.variants[0]?.price ?? product.basePrice;
  const compareAtPrice = product.variants[0]?.compareAtPrice;

  return {
    id: product.id,
    variantId: product.variants[0]?.id ?? "",
    variantLabel: product.variants[0]?.label,
    slug: product.slug,
    name,
    collection: { slug: product.collection.slug, name: collectionName(product.collection.slug, product.collection.name, lang) } as {
      slug: "cristalina" | "floating" | "grrr";
      name: string;
    },
    temperatureLabel: temp,
    temperature: temp,
    price: Number(price),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
    currency: product.currency,
    variantPrices: product.variants.map((v) => ({ id: v.id, label: v.label, price: Number(v.price) })),
    imageUrl: product.images[0]?.url ?? "/images/placeholder.jpg",
    imageAltUrl: product.images[1]?.url,
    imageAlt: lang === "es" ? (product.images[0]?.alt ?? product.name) : tr(lang, "seoImgAlt", { name }),
    inStock: inventory ? inventory.status !== "OUT_OF_STOCK" : true,
    stockQuantity: inventory?.quantity,
  };
}

export async function getProductCards(collectionSlug?: string, lang: Lang = "es") {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      ...(collectionSlug ? { collection: { slug: collectionSlug } } : {}),
    },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
  });
  const trs = await getProductTranslations(products.map((p) => p.id), lang);
  return products.map((p) => toCard(p, lang, trs.get(p.id)));
}

// Para /admin/productos — a diferencia de getProductCards, trae TODAS las presentaciones
// (pesos) de cada producto con su propio precio y stock, no solo la primera.
export async function getAdminProductList() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    include: {
      collection: { select: { name: true } },
      variants: { include: { inventory: true }, orderBy: { price: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
  return products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    collectionName: p.collection.name,
    variants: p.variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: Number(v.price),
      stockQuantity: v.inventory?.quantity ?? 0,
      inStock: v.inventory ? v.inventory.status !== "OUT_OF_STOCK" : true,
    })),
  }));
}

export async function getFeaturedProductCards(limit = 4, lang: Lang = "es") {
  const products = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null },
    include: cardInclude,
    orderBy: { isFeatured: "desc" },
    take: limit,
  });
  const trs = await getProductTranslations(products.map((p) => p.id), lang);
  return products.map((p) => toCard(p, lang, trs.get(p.id)));
}

export async function getProductDetail(slug: string, lang: Lang = "es") {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      collection: { select: { slug: true, name: true } },
      images: { orderBy: { sortOrder: "asc" } },
      videos: { orderBy: { sortOrder: "asc" } },
      variants: { include: { inventory: true }, orderBy: { price: "asc" } },
      attributeValues: { include: { attributeValue: { include: { attribute: true } } } },
      reviews: { where: { status: "APPROVED" }, include: { images: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) return null;

  const trans = (await getProductTranslations([product.id], lang)).get(product.id);
  const name = trans?.name ?? product.name;

  const inventory = product.variants[0]?.inventory;
  const price = product.variants[0]?.price ?? product.basePrice;
  const compareAtPrice = product.variants[0]?.compareAtPrice;

  return {
    slug: product.slug,
    name,
    nameEs: product.name, // el carrito y los pedidos siguen usando el nombre en español
    metaTitle: trans?.metaTitle,
    metaDescription: trans?.metaDescription,
    collection: { slug: product.collection.slug, name: collectionName(product.collection.slug, product.collection.name, lang) } as {
      slug: "cristalina" | "floating" | "grrr";
      name: string;
    },
    price: Number(price),
    compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
    currency: product.currency,
    shortDescription: trans?.shortDescription ?? product.shortDescription,
    description: trans?.description ?? product.description,
    applicationInstructions: trans?.applicationInstructions ?? product.applicationInstructions,
    inStock: product.variants.length === 0 ? true : product.variants.some((v) => (v.inventory ? v.inventory.status !== "OUT_OF_STOCK" : true)),
    stockQuantity: inventory?.quantity ?? 0,
    attributes: [{ label: tr(lang, "attrTemperature"), value: localizeTemp(attrValue(product, "temperature"), lang) }],
    variants: product.variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: Number(v.price),
      compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
      inStock: v.inventory ? v.inventory.status !== "OUT_OF_STOCK" : true,
    })),
    images: product.images.map((img) => ({ url: img.url, alt: lang === "es" ? img.alt : tr(lang, "seoImgAlt", { name }), type: img.type })),
    videoUrl: product.videos[0]?.url,
    reviews: product.reviews.map((r) => ({
      id: r.id,
      author: tr(lang, "verifiedClient"), // v1: Review.userId es opcional/anónimo por defecto; anexar User.name cuando esté disponible
      rating: r.rating,
      comment: r.comment,
      imageUrl: r.images[0]?.url,
    })),
  };
}

export async function getRelatedProductCards(currentSlug: string, collectionSlug: string, limit = 4, lang: Lang = "es") {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      slug: { not: currentSlug },
      collection: { slug: collectionSlug },
    },
    include: cardInclude,
    take: limit,
  });
  const trs = await getProductTranslations(products.map((p) => p.id), lang);
  return products.map((p) => toCard(p, lang, trs.get(p.id)));
}

export async function searchProductCards(query: string) {
  if (!query.trim()) return [];
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { collection: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: cardInclude,
    take: 24,
  });
  return products.map((p) => toCard(p));
}

export async function getFilterGroups(lang: Lang = "es") {
  const attributes = await prisma.attribute.findMany({
    include: { values: { orderBy: { value: "asc" } } },
  });

  const groups = attributes.map((attr) => ({
    key: attr.key,
    label: lang !== "es" && attr.key === "temperature" ? tr(lang, "attrTemperature") : attr.label,
    options: attr.values.map((v) => localizeTemp(v.value, lang)),
  }));

  const collectionOptions = await prisma.collection.findMany({ orderBy: { sortOrder: "asc" }, select: { slug: true, name: true } });
  groups.push({
    key: "collection",
    label: tr(lang, "attrCollection"),
    options: collectionOptions.map((c) => collectionName(c.slug, c.name, lang)),
  });

  return groups;
}
