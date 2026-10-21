import type { MetadataRoute } from "next";
import { getCollections } from "@/lib/queries/collections";
import { prisma } from "@/lib/prisma";
import { altPaths, BASE_URL, type Lang } from "@/lib/i18n-dict";

type Entry = MetadataRoute.Sitemap[number];

// Páginas traducidas: una entrada por idioma, cada una con sus alternativas (hreflang).
function translated(path: string, lastModified: Date, priority: number, changeFrequency: Entry["changeFrequency"]): Entry[] {
  const alts = altPaths(path);
  const full = (l: Lang) => `${BASE_URL}${alts[l] === "/" ? "" : alts[l]}`;
  const languages = { es: full("es"), en: full("en"), ru: full("ru") };
  return (["es", "en", "ru"] as Lang[]).map((l) => ({
    url: full(l),
    lastModified,
    changeFrequency,
    priority: l === "es" ? priority : Math.max(0.3, priority - 0.2),
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, products] = await Promise.all([
    getCollections(),
    prisma.product.findMany({ where: { isActive: true, deletedAt: null }, select: { slug: true, updatedAt: true } }),
  ]);

  const now = new Date();

  // Solo en español (no tienen versión traducida)
  const staticRoutes: Entry[] = [
    "/guia",
    "/guia/temperaturas-y-conos",
    "/guia/superficies",
    "/guia/como-aplicar",
    "/nosotros",
    "/coworking",
    "/esmaltes-para-gres",
    "/contacto",
    "/envios-y-devoluciones",
    "/terminos",
    "/privacidad",
  ].map((path) => ({ url: `${BASE_URL}${path}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 }));

  return [
    ...translated("/", now, 1, "weekly"),
    ...translated("/catalogo", now, 0.9, "weekly"),
    ...collections.flatMap((c) => translated(`/catalogo/${c.slug}`, now, 0.8, "weekly")),
    ...products.flatMap((p) => translated(`/producto/${p.slug}`, p.updatedAt, 0.9, "monthly")),
    ...staticRoutes,
  ];
}
