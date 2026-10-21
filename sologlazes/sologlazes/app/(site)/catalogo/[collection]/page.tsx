import type { Metadata } from "next";
import { CollectionView, collectionMetadata } from "@/components/pages/collection-view";
import { getCollections } from "@/lib/queries/collections";

export const revalidate = 60; // re-consulta la base cada 60s como máximo, no queda "congelado" hasta el próximo deploy

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  return collectionMetadata(collection, "es");
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  return <CollectionView slug={collection} lang="es" />;
}
