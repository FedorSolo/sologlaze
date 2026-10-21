import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getCollections } from "@/lib/queries/collections";
import { hrefFor, tr, type Lang } from "@/lib/i18n-dict";
import { languageAlternates, ogLocales, absoluteUrl } from "@/lib/seo";
import { HtmlLang } from "@/components/shared/html-lang";

const collectionAccent: Record<string, string> = {
  cristalina: "bg-collection-cristalina",
  floating: "bg-collection-floating",
  grrr: "bg-collection-grrr",
};

export function homeMetadata(lang: Lang): Metadata {
  const alternates = languageAlternates("/", lang);
  if (lang === "es") return { alternates };
  const title = tr(lang, "seoHomeTitle");
  const description = tr(lang, "seoHomeDesc");
  return {
    title: { absolute: title },
    description,
    alternates,
    openGraph: { title, description, url: absoluteUrl(`/${lang}`), type: "website", ...ogLocales(lang) },
  };
}

export async function HomeView({ lang }: { lang: Lang }) {
  const collections = await getCollections(lang);
  const t = (key: string, vars?: Record<string, string | number>) => tr(lang, key, vars);
  const href = (path: string) => hrefFor(lang, path);

  return (
    <>
      {lang !== "es" && <HtmlLang lang={lang} />}
      <h1 className="sr-only">{t("homeH1")}</h1>

      {/* Hero — imagen a pantalla completa, sin texto encima */}
      <section className="relative -mt-px h-[38vh] w-full overflow-hidden lg:h-[52vh]">
        <Image src="/images/hero.jpg" alt={t("heroAlt")} fill priority quality={95} sizes="100vw" className="object-cover" />
      </section>

      <section className="container flex flex-col items-center gap-4 py-5 text-center lg:py-6">
        <span className="rounded-full bg-accent-soft px-4 py-1.5 text-caption uppercase tracking-wide text-accent">{t("badge")}</span>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href={href("/catalogo")} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white transition-colors hover:bg-accent-hover">
            {t("verCatalogo")} <ArrowRight size={18} />
          </Link>
          <Link href="/guia" className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 transition-colors hover:bg-surface-muted">
            {t("noSeQueElegir")}
          </Link>
        </div>
      </section>

      {/* Colecciones */}
      <section className="container pb-16 pt-2 lg:pb-24 lg:pt-4">
        <h2 className="mb-6 text-h2 lg:text-h2-lg">{t("nuestrasLineas")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={href(`/catalogo/${c.slug}`)}
              className="group overflow-hidden rounded-lg border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
                <Image
                  src={c.heroImageUrl}
                  alt={t("lineAlt", { name: c.name })}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className={`mb-4 h-1 w-10 rounded-full ${collectionAccent[c.slug] ?? "bg-accent"}`} />
                <h3 className="mb-2 text-h3">{c.name}</h3>
                <p className="mb-4 line-clamp-4 text-body text-text-secondary">{c.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-accent">
                  {t("explorar")} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Coworking */}
      <section className="bg-surface-muted py-16 lg:py-24">
        <div className="container flex flex-col items-center gap-4 text-center">
          <p className="text-h3 uppercase tracking-wide text-accent">{t("coworkingKicker")}</p>
          <h2 className="max-w-2xl text-h2 lg:text-h2-lg">{t("coworkingH2")}</h2>
          <p className="max-w-xl text-body text-text-secondary">{t("coworkingText")}</p>
          <Link href="/coworking" className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm text-white transition-colors hover:bg-accent-hover">
            {t("coworkingBtn")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Mercado Libre */}
      <section className="py-16 lg:py-24">
        <div className="container flex flex-col items-center gap-4 text-center">
          <p className="text-h3 uppercase tracking-wide text-accent">{t("mlKicker")}</p>
          <h2 className="max-w-2xl text-h2 lg:text-h2-lg">{t("mlH2")}</h2>
          <p className="max-w-xl text-body text-text-secondary">{t("mlText")}</p>
          <a
            href="https://www.mercadolibre.com.ar/pagina/solotu_ceramics#from=share_eshop"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-[999px] bg-accent px-6 py-3 text-sm text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md"
          >
            {t("mlBtn")} <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* CTA final */}
      <section className="container pb-24">
        <div className="flex flex-col items-center gap-4 rounded-lg bg-text-primary px-6 py-16 text-center text-bg">
          <h2 className="text-h2 lg:text-h2-lg">{t("ctaH2")}</h2>
          <p className="max-w-md text-body text-bg/80">{t("ctaText")}</p>
          <a href="https://wa.me/5491127379589" className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white transition-colors hover:bg-accent-hover">
            <MessageCircle size={18} /> {t("ctaBtn")}
          </a>
        </div>
      </section>
    </>
  );
}
