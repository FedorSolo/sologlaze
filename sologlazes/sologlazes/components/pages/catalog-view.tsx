import type { Metadata } from "next";
import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getProductCards, getFilterGroups } from "@/lib/queries/products";
import { hrefFor, tr, type Lang } from "@/lib/i18n-dict";
import { languageAlternates, ogLocales, absoluteUrl } from "@/lib/seo";
import { HtmlLang } from "@/components/shared/html-lang";

export function catalogMetadata(lang: Lang): Metadata {
  const title = tr(lang, "catalogTitle");
  const description = tr(lang, "catalogDesc");
  return {
    title,
    description,
    alternates: languageAlternates("/catalogo", lang),
    openGraph: { title, description, url: absoluteUrl(lang === "es" ? "/catalogo" : `/${lang}/catalogo`), type: "website", ...ogLocales(lang) },
  };
}

export async function CatalogView({ lang }: { lang: Lang }) {
  const [products, filterGroups] = await Promise.all([getProductCards(undefined, lang), getFilterGroups(lang)]);

  return (
    <div className="container py-10 lg:py-14">
      {lang !== "es" && <HtmlLang lang={lang} />}
      <nav aria-label={tr(lang, "breadcrumb")} className="mb-4 text-sm text-text-secondary">
        {lang === "es" ? (
          <>Inicio / Catálogo</>
        ) : (
          <>
            <Link href={hrefFor(lang, "/")}>{tr(lang, "inicio")}</Link> / {tr(lang, "catalogo")}
          </>
        )}
      </nav>
      <h1 className="mb-8 text-h1 lg:text-h1-lg">{tr(lang, "catalogo")}</h1>
      <CatalogBrowser products={products} filterGroups={filterGroups} />
    </div>
  );
}
