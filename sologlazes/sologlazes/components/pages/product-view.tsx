import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductDetail, getRelatedProductCards } from "@/lib/queries/products";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import { ProductReviews } from "@/components/product/product-reviews";
import { ReviewForm } from "@/components/product/review-form";
import { ProductCard } from "@/components/shop/product-card";
import { hrefFor, tr, type Lang } from "@/lib/i18n-dict";
import { languageAlternates, ogLocales, absoluteUrl } from "@/lib/seo";
import { HtmlLang } from "@/components/shared/html-lang";

// Recorta a ~160 caracteres sin cortar palabras (la descripción trae saltos de línea y tablas).
function snippet(text: string, max = 158) {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= max) return flat;
  const cut = flat.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\-–—]+$/, "")}…`;
}

export async function productMetadata(slug: string, lang: Lang): Promise<Metadata> {
  const product = await getProductDetail(slug, lang);
  if (!product) return {};

  const title = product.metaTitle ?? tr(lang, "seoProductTitle", { name: product.name, collection: product.collection.name });
  const seoDescription =
    product.metaDescription ??
    (product.description && product.description.length > product.shortDescription.length
      ? snippet(product.description)
      : product.shortDescription);
  const url = absoluteUrl(hrefFor(lang, `/producto/${product.slug}`));
  const image = product.images[0]?.url;

  return {
    title,
    description: seoDescription,
    keywords: [product.name, `${lang === "es" ? "esmalte" : lang === "en" ? "glaze" : "глазурь"} ${product.collection.name}`, ...tr(lang, "seoKeywords").split(","), "SoloGlazes"],
    alternates: languageAlternates(`/producto/${product.slug}`, lang),
    openGraph: { title: product.name, description: seoDescription, images: image ? [image] : undefined, type: "website", url, ...ogLocales(lang) },
    twitter: { card: "summary_large_image", title: product.name, description: seoDescription, images: image ? [image] : undefined },
  };
}

export async function ProductView({ slug, lang }: { slug: string; lang: Lang }) {
  const product = await getProductDetail(slug, lang);
  if (!product) notFound();

  const [related, session] = await Promise.all([
    getRelatedProductCards(product.slug, product.collection.slug, 4, lang),
    auth(),
  ]);

  let initialFavorited = false;
  if (session?.user?.id) {
    const fav = await prisma.favorite.findFirst({
      where: { userId: session.user.id, product: { slug: product.slug } },
    });
    initialFavorited = !!fav;
  }

  const productUrl = absoluteUrl(hrefFor(lang, `/producto/${product.slug}`));
  const variants = product.variants ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    url: productUrl,
    brand: { "@type": "Brand", name: "SoloGlazes" },
    category: product.collection.name,
    inLanguage: lang,
    // Una oferta por peso (0.5 kg / 1 kg), cada una con su precio y su disponibilidad.
    offers:
      variants.length > 0
        ? variants.map((v) => ({
            "@type": "Offer",
            name: v.label,
            url: productUrl,
            priceCurrency: product.currency,
            price: v.price,
            itemCondition: "https://schema.org/NewCondition",
            availability: v.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "SoloGlazes" },
          }))
        : {
            "@type": "Offer",
            url: productUrl,
            priceCurrency: product.currency,
            price: product.price,
            itemCondition: "https://schema.org/NewCondition",
            availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
    aggregateRating:
      product.reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length).toFixed(1),
            reviewCount: product.reviews.length,
          }
        : undefined,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tr(lang, "inicio"), item: absoluteUrl(hrefFor(lang, "/")) },
      { "@type": "ListItem", position: 2, name: tr(lang, "catalogo"), item: absoluteUrl(hrefFor(lang, "/catalogo")) },
      { "@type": "ListItem", position: 3, name: product.collection.name, item: absoluteUrl(hrefFor(lang, `/catalogo/${product.collection.slug}`)) },
      { "@type": "ListItem", position: 4, name: product.name, item: productUrl },
    ],
  };

  return (
    <div className="container py-10 lg:py-14">
      {lang !== "es" && <HtmlLang lang={lang} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav aria-label={tr(lang, "breadcrumb")} className="mb-6 text-sm text-text-secondary">
        <Link href={hrefFor(lang, "/")}>{tr(lang, "inicio")}</Link> / <Link href={hrefFor(lang, "/catalogo")}>{tr(lang, "catalogo")}</Link> /{" "}
        <Link href={hrefFor(lang, `/catalogo/${product.collection.slug}`)}>{product.collection.name}</Link> / {product.name}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} initialFavorited={initialFavorited} />
      </div>

      <section className="mx-auto mt-16 max-w-2xl border-t border-border pt-10 lg:mt-24">
        <h2 className="mb-6 text-h2">{tr(lang, "reviews")}</h2>
        <ProductReviews reviews={product.reviews} lang={lang} />
        <div className="mt-6">
          <ReviewForm productSlug={product.slug} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10 lg:mt-24">
          <h2 className="mb-6 text-h2">{tr(lang, "related")}</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
