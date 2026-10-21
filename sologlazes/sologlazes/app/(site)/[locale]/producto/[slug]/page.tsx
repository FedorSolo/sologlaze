import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView, productMetadata } from "@/components/pages/product-view";
import { prisma } from "@/lib/prisma";
import { isLocale } from "@/lib/i18n-dict";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ where: { isActive: true, deletedAt: null }, select: { slug: true } });
  return ["en", "ru"].flatMap((locale) => products.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  return isLocale(locale) ? productMetadata(slug, locale) : {};
}

export default async function LocaleProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  return <ProductView slug={slug} lang={locale} />;
}
