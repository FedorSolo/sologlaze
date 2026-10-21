"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { assertAdmin } from "@/lib/admin-guard";

const LANGS = ["en", "ru"] as const;

// Guarda las traducciones (EN y RU) de un producto. Una traducción con el nombre vacío se borra:
// el sitio vuelve a mostrar el español en ese idioma.
export async function saveProductTranslationsAction(formData: FormData) {
  await assertAdmin();

  const productId = String(formData.get("productId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!productId) throw new Error("Falta el producto.");

  const text = (key: string) => String(formData.get(key) ?? "").trim();

  for (const lang of LANGS) {
    const name = text(`name_${lang}`);
    if (!name) {
      await prisma.productTranslation.deleteMany({ where: { productId, lang } });
      continue;
    }
    const data = {
      name,
      shortDescription: text(`short_${lang}`),
      description: text(`description_${lang}`),
      applicationInstructions: text(`instructions_${lang}`),
      metaTitle: text(`metaTitle_${lang}`) || null,
      metaDescription: text(`metaDescription_${lang}`) || null,
    };
    await prisma.productTranslation.upsert({
      where: { productId_lang: { productId, lang } },
      update: data,
      create: { productId, lang, ...data },
    });
  }

  for (const lang of LANGS) {
    revalidatePath(`/${lang}/producto/${slug}`);
    revalidatePath(`/${lang}/catalogo`);
  }
  redirect(`/admin/productos/${slug}/traducciones?saved=1`);
}
