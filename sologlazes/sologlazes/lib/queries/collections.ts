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

export async function getCollections(lang: Lang = "es") {
  const rows = await prisma.collection.findMany({ orderBy: { sortOrder: "asc" } });
  return localize(rows, lang);
}

export async function getCollectionBySlug(slug: string, lang: Lang = "es") {
  const row = await prisma.collection.findUnique({ where: { slug } });
  if (!row) return null;
  return (await localize([row], lang))[0];
}
