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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) return {};
  const seoDescription =
    product.description && product.description.length > product.shortDescription.length
      ? product.description.slice(0, 160)
      : product.shortDescription;
  return {
    title: `${product.name} — Esmalte cerámico ${product.collection.name}`,
    description: seoDescription,
    keywords: [
      product.name,
      `esmalte ${product.collection.name}`,
      "esmalte cerámico",
      "esmalte para gres",
      "cerámica cono 5-6",
      "SoloGlazes",
    ],
    alternates: { canonical: `https://sologlazes.com.ar/producto/${product.slug}` },
    openGraph: {
      title: product.name,
      description: seoDescription,
      images: product.images[0] ? [product.images[0].url] : undefined,
      type: "website",
      url: `https://sologlazes.com.ar/producto/${product.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: seoDescription,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductDetail(slug);
  if (!product) notFound();

  const [related, session] = await Promise.all([
    getRelatedProductCards(product.slug, product.collection.slug),
    auth(),
  ]);

  let initialFavorited = false;
  if (session?.user?.id) {
    const fav = await prisma.favorite.findFirst({
      where: { userId: session.user.id, product: { slug: product.slug } },
    });
    initialFavorited = !!fav;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: product.currency,
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (
              product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
            ).toFixed(1),
            reviewCount: product.reviews.length,
          }
        : undefined,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://sologlazes.com.ar" },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: "https://sologlazes.com.ar/catalogo" },
      {
        "@type": "ListItem",
        position: 3,
        name: product.collection.name,
        item: `https://sologlazes.com.ar/catalogo/${product.collection.slug}`,
      },
      { "@type": "ListItem", position: 4, name: product.name, item: `https://sologlazes.com.ar/producto/${product.slug}` },
    ],
  };

  return (
    <div className="container py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-secondary">
        <Link href="/">Inicio</Link> / <Link href="/catalogo">Catálogo</Link> /{" "}
        <Link href={`/catalogo/${product.collection.slug}`}>{product.collection.name}</Link> / {product.name}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} initialFavorited={initialFavorited} />
      </div>

      <section className="mx-auto mt-16 max-w-2xl border-t border-border pt-10 lg:mt-24">
        <h2 className="mb-6 text-h2">Reseñas</h2>
        <ProductReviews reviews={product.reviews} />
        <div className="mt-6">
          <ReviewForm productSlug={product.slug} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16 border-t border-border pt-10 lg:mt-24">
          <h2 className="mb-6 text-h2">También te puede interesar</h2>
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
