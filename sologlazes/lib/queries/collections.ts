import { prisma } from "@/lib/prisma";

export async function getCollections() {
  return prisma.collection.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getCollectionBySlug(slug: string) {
  return prisma.collection.findUnique({ where: { slug } });
}
