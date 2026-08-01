import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { ProductCardData } from "@/components/shop/product-card";

// Selección compartida: trae justo lo necesario para tarjeta de catálogo + atributos de filtro.
const cardInclude = {
  collection: { select: { slug: true, name: true } },
  images: { orderBy: { sortOrder: "asc" as const }, take: 2 },
  attributeValues: { include: { attributeValue: { include: { attribute: true } } } },
  variants: { include: { inventory: true }, take: 1 },
} satisfies Prisma.ProductInclude;

type ProductWithCardRelations = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

function attrValue(product: { attributeValues: { attributeValue: { attribute: { key: string }; value: string } }[] }, key: string) {
  return product.attributeValues.find((av) => av.attributeValue.attribute.key === key)?.attributeValue.value ?? "—";
}

function toCard(product: ProductWithCardRelations): ProductCardData & {
  temperature: string;
} {
  const inventory = product.variants[0]?.inventory;
  const price = product.variants[0]?.price ?? product.basePrice;

  return {
    slug: product.slug,
    name: product.name,
    collection: product.collection as { slug: "cristalina" | "floating" | "grrr"; name: string },
    temperatureLabel: attrValue(product, "temperature"),
    temperature: attrValue(product, "temperature"),
    price: Number(price),
    currency: product.currency,
    imageUrl: product.images[0]?.url ?? "/images/placeholder.jpg",
    imageAltUrl: product.images[1]?.url,
    imageAlt: product.images[0]?.alt ?? product.name,
    inStock: inventory ? inventory.status !== "OUT_OF_STOCK" : true,
  };
}

export async function getProductCards(collectionSlug?: string) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      deletedAt: null,
      ...(collectionSlug ? { collection: { slug: collectionSlug } } : {}),
    },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCard);
}

export async function getFeaturedProductCards(limit = 4) {
  const products = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null },
    include: cardInclude,
    orderBy: { isFeatured: "desc" },
    take: limit,
  });
  return products.map(toCard);
}

export async function getProductDetail(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      collection: { select: { slug: true, name: true } },
      images: { orderBy: { sortOrder: "asc" } },
      videos: { orderBy: { sortOrder: "asc" } },
      variants: { include: { inventory: true } },
      attributeValues: { include: { attributeValue: { include: { attribute: true } } } },
      reviews: { where: { status: "APPROVED" }, include: { images: true }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) return null;

  const inventory = product.variants[0]?.inventory;
  const price = product.variants[0]?.price ?? product.basePrice;

  return {
    slug: product.slug,
    name: product.name,
    collection: product.collection as { slug: "cristalina" | "floating" | "grrr"; name: string },
    price: Number(price),
    currency: product.currency,
    shortDescription: product.shortDescription,
    description: product.description,
    applicationInstructions: product.applicationInstructions,
    inStock: inventory ? inventory.status !== "OUT_OF_STOCK" : true,
    attributes: [{ label: "Temperatura", value: attrValue(product, "temperature") }],
    variants: product.variants.map((v) => ({ id: v.id, label: v.label, price: Number(v.price) })),
    images: product.images.map((img) => ({ url: img.url, alt: img.alt, type: img.type })),
    videoUrl: product.videos[0]?.url,
    reviews: product.reviews.map((r) => ({
      id: r.id,
      author: "Cliente verificado", // v1: Review.userId es opcional/anónimo por defecto; anexar User.name cuando esté disponible
      rating: r.rating,
      comment: r.comment,
      imageUrl: r.images[0]?.url,
    })),
  };
}

export async function getRelatedProductCards(currentSlug: string, collectionSlug: string, limit = 4) {
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
  return products.map(toCard);
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
  return products.map(toCard);
}

export async function getFilterGroups() {
  const attributes = await prisma.attribute.findMany({
    include: { values: { orderBy: { value: "asc" } } },
  });

  const groups = attributes.map((attr) => ({
    key: attr.key,
    label: attr.label,
    options: attr.values.map((v) => v.value),
  }));

  const collectionOptions = await prisma.collection.findMany({ orderBy: { sortOrder: "asc" }, select: { name: true } });
  groups.push({ key: "collection", label: "Serie", options: collectionOptions.map((c) => c.name) });

  return groups;
}
