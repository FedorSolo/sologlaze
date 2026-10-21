import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getCollectionBySlug } from "@/lib/queries/collections";
import { getProductCards, getFilterGroups } from "@/lib/queries/products";
import { collectionSeoText } from "@/lib/collection-seo";
import { hrefFor, tr, type Lang } from "@/lib/i18n-dict";
import { languageAlternates, ogLocales, absoluteUrl } from "@/lib/seo";
import { HtmlLang } from "@/components/shared/html-lang";

export async function collectionMetadata(slug: string, lang: Lang): Promise<Metadata> {
  const collection = await getCollectionBySlug(slug, lang);
  if (!collection) return {};
  const url = absoluteUrl(hrefFor(lang, `/catalogo/${collection.slug}`));
  // El título lleva palabras que la gente busca ("esmaltes … para cerámica"), no solo el nombre de la línea.
  const title = collectionSeoText[collection.slug]?.[lang]?.heading ?? collection.name;
  return {
    title,
    description: collection.description,
    alternates: languageAlternates(`/catalogo/${collection.slug}`, lang),
    openGraph: {
      title: collection.name,
      description: collection.description,
      images: collection.heroImageUrl ? [collection.heroImageUrl] : undefined,
      url,
      type: "website",
      ...ogLocales(lang),
    },
  };
}

export async function CollectionView({ slug, lang }: { slug: string; lang: Lang }) {
  const collection = await getCollectionBySlug(slug, lang);
  if (!collection) notFound();

  const [products, filterGroups] = await Promise.all([getProductCards(slug, lang), getFilterGroups(lang)]);
  const seo = collectionSeoText[collection.slug]?.[lang];
  const collectionUrl = absoluteUrl(hrefFor(lang, `/catalogo/${collection.slug}`));

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tr(lang, "inicio"), item: absoluteUrl(hrefFor(lang, "/")) },
      { "@type": "ListItem", position: 2, name: tr(lang, "catalogo"), item: absoluteUrl(hrefFor(lang, "/catalogo")) },
      { "@type": "ListItem", position: 3, name: collection.name, item: collectionUrl },
    ],
  };

  // Lista de productos de la colección: ayuda a Google a entender de qué trata la página.
  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description,
    url: collectionUrl,
    inLanguage: lang,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(hrefFor(lang, `/producto/${p.slug}`)),
        name: p.name,
      })),
    },
  };

  const faqLd = seo && {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: seo.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="container py-10 lg:py-14">
      {lang !== "es" && <HtmlLang lang={lang} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      {seo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <nav aria-label={tr(lang, "breadcrumb")} className="mb-4 text-sm text-text-secondary">
        <Link href={hrefFor(lang, "/")}>{tr(lang, "inicio")}</Link> / <Link href={hrefFor(lang, "/catalogo")}>{tr(lang, "catalogo")}</Link> / {collection.name}
      </nav>
      <h1 className="mb-2 text-h1 lg:text-h1-lg">{collection.name}</h1>
      <p className="mb-8 max-w-xl text-body-lg text-text-secondary">{collection.description}</p>
      <CatalogBrowser products={products} filterGroups={filterGroups} />

      {seo && (
        <section className="mx-auto mt-16 max-w-3xl border-t border-border pt-10 text-center">
          <h2 className="mb-5 text-h2 text-text-primary">{seo.heading}</h2>
          {seo.paragraphs.map((p, i) => (
            <p key={i} className="mb-4 text-body leading-relaxed text-text-secondary">
              {p}
            </p>
          ))}

          <h3 className="mb-6 mt-12 text-h3 text-text-primary">{seo.faqHeading}</h3>
          <dl className="mx-auto grid gap-4 text-left sm:grid-cols-2">
            {seo.faq.map((f, i) => (
              <div key={i} className="rounded-lg border border-border bg-surface p-5">
                <dt className="mb-2 text-body font-medium text-text-primary">{f.q}</dt>
                <dd className="text-sm leading-relaxed text-text-secondary">{f.a}</dd>
              </div>
            ))}
          </dl>

          <nav aria-label={tr(lang, "nuestrasLineas")} className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <span className="text-text-secondary">{tr(lang, "nuestrasLineas")}:</span>
            {Object.keys(collectionSeoText)
              .filter((k) => k !== collection.slug)
              .map((k) => (
                <Link key={k} href={hrefFor(lang, `/catalogo/${k}`)} className="text-accent hover:underline">
                  {collectionSeoText[k][lang].heading}
                </Link>
              ))}
          </nav>
        </section>
      )}
    </div>
  );
}
