import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { getProductCards } from "@/lib/queries/products";
import { ProductCard } from "@/components/shop/product-card";

export type LandingSection = { h2: string; paragraphs?: string[]; list?: string[]; ordered?: boolean };
export type LandingConfig = {
  path: string; // "/esmalte-para-vajilla"
  title: string;
  description: string;
  h1: string;
  intro: string;
  breadcrumb: string;
  collections?: string[]; // limita los productos a estas colecciones
  includePack?: boolean;
  sections: LandingSection[];
  faq: { q: string; a: string }[];
  related: { href: string; label: string }[];
};

export const LANDINGS_NAV = [
  { href: "/esmaltes-para-gres", label: "Esmaltes para gres" },
  { href: "/esmalte-para-vajilla", label: "Esmalte para vajilla" },
  { href: "/esmalte-ceramico-en-polvo", label: "Esmalte cerámico en polvo" },
  { href: "/esmaltes-para-ceramica", label: "Esmaltes para cerámica" },
];

export function landingMetadata(c: LandingConfig): Metadata {
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: absoluteUrl(c.path) },
    openGraph: { title: c.h1, description: c.description, url: absoluteUrl(c.path), type: "website" },
  };
}

export async function SeoLanding({ c }: { c: LandingConfig }) {
  let products: Awaited<ReturnType<typeof getProductCards>> = [];
  try {
    products = await getProductCards(undefined, "es");
    if (c.collections) products = products.filter((p) => c.collections!.includes(p.collection.slug));
    if (!c.includePack) products = products.filter((p) => p.slug !== "pack-prueba-5x200g");
  } catch {
    products = [];
  }

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: "es",
      mainEntity: c.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: c.breadcrumb, item: absoluteUrl(c.path) },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: c.h1,
      description: c.description,
      url: absoluteUrl(c.path),
      inLanguage: "es",
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: products.length,
        itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/producto/${p.slug}`), name: p.name })),
      },
    },
  ];

  return (
    <div className="container py-10 lg:py-14">
      {ld.map((o, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />
      ))}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        <Link href="/">Inicio</Link> / {c.breadcrumb}
      </nav>

      <h1 className="mb-4 text-h1 lg:text-h1-lg">{c.h1}</h1>
      <p className="mb-8 max-w-3xl text-body-lg text-text-secondary">{c.intro}</p>

      {products.length > 0 && (
        <section aria-label={c.breadcrumb} className="mb-14">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <p className="mt-6 text-center text-sm">
            <Link href="/catalogo/pack-prueba" className="text-accent hover:underline">¿No sabés qué color elegir? Probá 5 esmaltes con el Pack Prueba</Link>
          </p>
        </section>
      )}

      <div className="mx-auto max-w-3xl">
        {c.sections.map((s) => (
          <section key={s.h2} className="mb-10">
            <h2 className="mb-3 text-h2">{s.h2}</h2>
            {s.paragraphs?.map((p, i) => (
              <p key={i} className="mb-3 text-body leading-relaxed text-text-secondary">{p}</p>
            ))}
            {s.list &&
              (s.ordered ? (
                <ol className="list-decimal space-y-1 pl-5 text-body text-text-secondary">{s.list.map((l) => <li key={l}>{l}</li>)}</ol>
              ) : (
                <ul className="list-disc space-y-1 pl-5 text-body text-text-secondary">{s.list.map((l) => <li key={l}>{l}</li>)}</ul>
              ))}
          </section>
        ))}

        <h2 className="mb-4 text-h2">Preguntas frecuentes</h2>
        <dl className="mb-10 space-y-3">
          {c.faq.map((f) => (
            <div key={f.q} className="rounded-lg border border-border p-4">
              <dt className="mb-1 text-body font-medium">{f.q}</dt>
              <dd className="text-sm leading-relaxed text-text-secondary">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <Link href="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
            Ver todo el catálogo <ArrowRight size={16} />
          </Link>
          <Link href="/envios-y-devoluciones" className="text-sm text-accent hover:underline">Envíos y devoluciones</Link>
        </div>

        <nav aria-label="Páginas relacionadas" className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-6 text-sm">
          <span className="text-text-secondary">Ver también:</span>
          {[...c.related, ...LANDINGS_NAV.filter((n) => n.href !== c.path && !c.related.some((r) => r.href === n.href))].map((r) => (
            <Link key={r.href} href={r.href} className="text-accent hover:underline">{r.label}</Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
