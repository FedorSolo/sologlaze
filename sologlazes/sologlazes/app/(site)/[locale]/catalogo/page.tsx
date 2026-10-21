import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView, catalogMetadata } from "@/components/pages/catalog-view";
import { isLocale } from "@/lib/i18n-dict";

export const revalidate = 60;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? catalogMetadata(locale) : {};
}

export default async function LocaleCatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <CatalogView lang={locale} />;
}
