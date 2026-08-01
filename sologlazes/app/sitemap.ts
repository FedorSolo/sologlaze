import type { MetadataRoute } from "next";
import { getCollections } from "@/lib/queries/collections";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://sologlazes.com.ar";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, products] = await Promise.all([
    getCollections(),
    prisma.product.findMany({ where: { isActive: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes = [
    "",
    "/catalogo",
    "/guia",
    "/guia/temperaturas-y-conos",
    "/guia/superficies",
    "/guia/como-aplicar",
    "/galeria",
    "/nosotros",
    "/esmaltes-para-gres",
    "/contacto",
    "/envios-y-devoluciones",
    "/terminos",
    "/privacidad",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const collectionRoutes = collections.map((c) => ({
    url: `${BASE_URL}/catalogo/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/producto/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
