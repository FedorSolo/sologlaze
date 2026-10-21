import { prisma } from "@/lib/prisma";
import { COLLECTION_NAMES, type Lang } from "@/lib/i18n-dict";

// Traducciones guardadas en la base (tablas ProductTranslation / CollectionTranslation).
// Si la tabla todavía no existe o la fila falta, se devuelve vacío y el sitio muestra el español:
// una traducción faltante nunca rompe una página.

export type ProductTr = {
  name?: string;
  shortDescription?: string;
  description?: string;
  applicationInstructions?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export type CollectionTr = { name?: string; description?: string };

const clean = (v: string | null | undefined) => (v && v.trim() ? v : undefined);

export async function getProductTranslations(ids: string[], lang: Lang): Promise<Map<string, ProductTr>> {
  const out = new Map<string, ProductTr>();
  if (lang === "es" || ids.length === 0) return out;
  try {
    const rows = await prisma.productTranslation.findMany({ where: { lang, productId: { in: ids } } });
    for (const r of rows) {
      out.set(r.productId, {
        name: clean(r.name),
        shortDescription: clean(r.shortDescription),
        description: clean(r.description),
        applicationInstructions: clean(r.applicationInstructions),
        metaTitle: clean(r.metaTitle),
        metaDescription: clean(r.metaDescription),
      });
    }
  } catch {
    // tabla inexistente o error de base: se usa el texto en español
  }
  return out;
}

export async function getCollectionTranslations(ids: string[], lang: Lang): Promise<Map<string, CollectionTr>> {
  const out = new Map<string, CollectionTr>();
  if (lang === "es" || ids.length === 0) return out;
  try {
    const rows = await prisma.collectionTranslation.findMany({ where: { lang, collectionId: { in: ids } } });
    for (const r of rows) out.set(r.collectionId, { name: clean(r.name), description: clean(r.description) });
  } catch {
    // idem
  }
  return out;
}

// Nombre de la línea en el idioma pedido (las cuatro líneas conocidas + traducción de la base).
export function collectionName(slug: string, base: string, lang: Lang) {
  return COLLECTION_NAMES[slug]?.[lang] ?? base;
}
