import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView, collectionMetadata } from "@/components/pages/collection-view";
import { getCollections } from "@/lib/queries/collections";
import { isLocale } from "@/lib/i18n-dict";

export const revalidate = 60;

export async function generateStaticParams() {
  const collections = await getCollections();
  return ["en", "ru"].flatMap((locale) => collections.map((c) => ({ locale, collection: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; collection: string }> }): Promise<Metadata> {
  const { locale, collection } = await params;
  return isLocale(locale) ? collectionMetadata(collection, locale) : {};
}

export default async function LocaleCollectionPage({ params }: { params: Promise<{ locale: string; collection: string }> }) {
  const { locale, collection } = await params;
  if (!isLocale(locale)) notFound();
  return <CollectionView slug={collection} lang={locale} />;
}
