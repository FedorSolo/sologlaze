import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { saveProductTranslationsAction } from "@/lib/actions/admin-translations";

export const dynamic = "force-dynamic";

const LANGS = [
  { code: "en", label: "English", site: "/en/producto/" },
  { code: "ru", label: "Русский", site: "/ru/producto/" },
] as const;

const input = "w-full rounded-sm border border-border px-3 py-2 text-sm focus:border-accent";

export default async function ProductTranslationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { slug } = await params;
  const { saved } = await searchParams;

  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) notFound();

  let translations: Awaited<ReturnType<typeof prisma.productTranslation.findMany>> = [];
  let missingTable = false;
  try {
    translations = await prisma.productTranslation.findMany({ where: { productId: product.id } });
  } catch {
    missingTable = true;
  }

  if (missingTable) {
    return (
      <div className="max-w-xl">
        <h1 className="mb-4 text-h1">Traducciones</h1>
        <div className="rounded-md bg-surface-muted p-5 text-sm">
          <p className="mb-2 font-medium">Falta crear las tablas de traducciones.</p>
          <p className="text-text-secondary">
            Ejecutá una sola vez el archivo <code>add-translations.sql</code> en Supabase → SQL Editor → Run, y recargá esta página.
          </p>
        </div>
      </div>
    );
  }

  const byLang = Object.fromEntries(translations.map((t) => [t.lang, t]));

  return (
    <div className="max-w-5xl">
      <Link href="/admin/productos" className="mb-4 inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary">
        <ArrowLeft size={14} /> Productos
      </Link>
      <h1 className="mb-1 text-h1">Traducciones: {product.name}</h1>
      <p className="mb-6 text-sm text-text-secondary">
        El texto en español (arriba de cada campo) es el original. Si dejás el nombre vacío, ese idioma muestra el español. Los precios, stock y fotos se editan en «Editar».
      </p>

      {saved && <p className="mb-6 rounded-md bg-status-success/10 p-3 text-sm text-status-success">Guardado ✓ — los cambios se ven en el sitio en menos de un minuto.</p>}

      <form action={saveProductTranslationsAction} className="space-y-10">
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="slug" value={product.slug} />

        {LANGS.map(({ code, label, site }) => {
          const t = byLang[code];
          return (
            <section key={code} className="rounded-lg border border-border">
              <div className="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-2.5">
                <h2 className="text-sm font-medium">{label}</h2>
                <a href={`${site}${product.slug}`} target="_blank" rel="noreferrer" className="text-xs text-accent hover:underline">
                  Ver página ↗
                </a>
              </div>
              <div className="space-y-5 p-4">
                <Field label="Nombre" es={product.name}>
                  <input name={`name_${code}`} defaultValue={t?.name ?? ""} className={input} />
                </Field>
                <Field label="Descripción corta" es={product.shortDescription}>
                  <input name={`short_${code}`} defaultValue={t?.shortDescription ?? ""} className={input} />
                </Field>
                <Field label="Descripción" es={product.description}>
                  <textarea name={`description_${code}`} defaultValue={t?.description ?? ""} rows={7} className={input} />
                </Field>
                <Field label="Instrucciones de aplicación" es={product.applicationInstructions}>
                  <textarea name={`instructions_${code}`} defaultValue={t?.applicationInstructions ?? ""} rows={8} className={input} />
                </Field>
                <div className="grid gap-5 md:grid-cols-2">
                  <Field label="Título para Google (opcional, ~60 caracteres)">
                    <input name={`metaTitle_${code}`} defaultValue={t?.metaTitle ?? ""} className={input} />
                  </Field>
                  <Field label="Descripción para Google (opcional, ~155 caracteres)">
                    <input name={`metaDescription_${code}`} defaultValue={t?.metaDescription ?? ""} className={input} />
                  </Field>
                </div>
              </div>
            </section>
          );
        })}

        <button type="submit" className="rounded-[999px] bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent-hover">
          Guardar traducciones
        </button>
      </form>
    </div>
  );
}

function Field({ label, es, children }: { label: string; es?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      {es && <span className="mb-1.5 block max-h-24 overflow-y-auto whitespace-pre-line rounded-sm bg-surface-muted px-3 py-2 text-xs text-text-secondary">{es}</span>}
      {children}
    </label>
  );
}
