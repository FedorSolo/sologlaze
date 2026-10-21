import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeView, homeMetadata } from "@/components/pages/home-view";
import { isLocale } from "@/lib/i18n-dict";

// /en y /ru. Las rutas fijas (catalogo, producto, carrito…) tienen prioridad sobre este segmento,
// así que cualquier otro texto en esta posición responde 404.
export const revalidate = 60;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? homeMetadata(locale) : {};
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomeView lang={locale} />;
}
