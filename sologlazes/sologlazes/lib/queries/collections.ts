import { prisma } from "@/lib/prisma";
import type { Lang } from "@/lib/i18n-dict";
import { collectionName, getCollectionTranslations } from "@/lib/translations";

type CollectionRow = Awaited<ReturnType<typeof prisma.collection.findMany>>[number];

async function localize(rows: CollectionRow[], lang: Lang) {
  if (lang === "es") return rows;
  const trs = await getCollectionTranslations(rows.map((r) => r.id), lang);
  return rows.map((r) => {
    const t = trs.get(r.id);
    return { ...r, name: t?.name ?? collectionName(r.slug, r.name, lang), description: t?.description ?? r.description };
  });
}

// La portada de "Pack Prueba" es la foto real del producto (la que se sube desde el admin).
// Para las demás colecciones se usa su heroImageUrl; si está vacío, la primera foto de un producto.
async function withHero(rows: CollectionRow[]) {
  const needs = rows.filter((r) => r.slug === "pack-prueba" || !r.heroImageUrl);
  if (needs.length === 0) return rows;
  const imgs = await prisma.productImage.findMany({
    where: { product: { collectionId: { in: needs.map((r) => r.id) }, isActive: true, deletedAt: null } },
    orderBy: [{ sortOrder: "asc" }],
    select: { url: true, product: { select: { collectionId: true } } },
  });
  const first = new Map<string, string>();
  for (const i of imgs) {
    const cid = i.product.collectionId;
    if (cid && !first.has(cid) && !i.url.includes("placeholder")) first.set(cid, i.url);
  }
  return rows.map((r) => ({ ...r, heroImageUrl: first.get(r.id) ?? r.heroImageUrl }));
}

export async function getCollections(lang: Lang = "es") {
  const rows = await prisma.collection.findMany({ orderBy: { sortOrder: "asc" } });
  return localize(await withHero(rows), lang);
}

export async function getCollectionBySlug(slug: string, lang: Lang = "es") {
  const row = await prisma.collection.findUnique({ where: { slug } });
  if (!row) return null;
  return (await localize(await withHero([row]), lang))[0];
}
