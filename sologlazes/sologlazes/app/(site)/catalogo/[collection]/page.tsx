import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getCollections, getCollectionBySlug } from "@/lib/queries/collections";
import { getProductCards, getFilterGroups } from "@/lib/queries/products";

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection: collectionSlug } = await params;
  const collection = await getCollectionBySlug(collectionSlug);
  if (!collection) return {};
  return { title: collection.name, description: collection.description };
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: collectionSlug } = await params;
  const collection = await getCollectionBySlug(collectionSlug);
  if (!collection) notFound();

  const [products, filterGroups] = await Promise.all([
    getProductCards(collectionSlug),
    getFilterGroups(),
  ]);

  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        <Link href="/">Inicio</Link> / <Link href="/catalogo">Catálogo</Link> / {collection.name}
      </nav>
      <h1 className="mb-2 text-h1 lg:text-h1-lg">{collection.name}</h1>
      <p className="mb-8 max-w-xl text-body-lg text-text-secondary">{collection.description}</p>
      <CatalogBrowser products={products} filterGroups={filterGroups} />
    </div>
  );
}
