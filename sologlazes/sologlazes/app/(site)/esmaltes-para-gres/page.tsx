import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { getProductCards } from "@/lib/queries/products";
import { ProductCard } from "@/components/shop/product-card";

export const revalidate = 60;

const TITLE = "Esmaltes para gres de alta temperatura (cono 5–6) — comprar online";
const DESCRIPTION =
  "Comprá esmaltes para gres en polvo de alta temperatura, cono 5–6 (1200 °C): Cristalina, Floating y GRRR, aptos para vajilla. Hechos en Buenos Aires, envíos a toda Argentina.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl("/esmaltes-para-gres") },
  openGraph: {
    title: "Esmaltes para gres de alta temperatura (cono 5–6)",
    description: "Esmaltes cerámicos en polvo para gres, vajilla y alta temperatura. Cristalina, Floating y GRRR. Hechos en Buenos Aires.",
    url: absoluteUrl("/esmaltes-para-gres"),
    type: "website",
  },
};

const comparison = [
  { line: "Cristalina", slug: "cristalina", effect: "Cristales abiertos, brillante", colors: "Miel, Gris, Rosado-Marrón, Lavanda, Verde", format: "500 g y 1 kg", apply: "Mezcla con agua y modificadores" },
  { line: "Floating", slug: "floating", effect: "Manchas flotantes y degradé natural", colors: "Verde, Verde Grisáceo, Celeste, Azul, Gris Oscuro, Menta, Rosa Crema", format: "500 g y 1 kg", apply: "Mezcla con agua y modificadores" },
  { line: "GRRR", slug: "grrr", effect: "Texturas de pelaje animal", colors: "Fuego, Leopardo de las Nieves, Pantera Rosa", format: "Consultá el tamaño en cada ficha", apply: "Dos capas: base y esmalte superior" },
  { line: "Pack Prueba", slug: "pack-prueba", effect: "5 esmaltes a elección para probar", colors: "Colores de Cristalina y Floating", format: "5 × 200 g (1,1 kg con modificadores)", apply: "Igual que la línea elegida" },
];

const uses = [
  "Gres y pastas de alta temperatura",
  "Porcelana",
  "Vajilla de uso diario: tazas, platos y bowls",
  "Piezas utilitarias y decorativas",
  "Cerámica artística y funcional",
];

const advantages = [
  "Fórmulas estables y repetibles",
  "Cobertura pareja sin chorreados excesivos",
  "Colores profundos y duraderos",
  "Pigmentos de primera calidad",
  "Probados en cono 5,5–6",
  "Modificadores incluidos y proporciones de agua detalladas para cada peso",
  "Compatibles entre sí para combinaciones creativas",
];

const steps = [
  { t: "Bizcochá la pieza", d: "El esmalte se aplica sobre cerámica ya bizcochada y limpia, sin polvo ni grasa." },
  { t: "Preparalo con agua y modificadores", d: "Mezclá el polvo con agua y agregá los modificadores incluidos, respetando las proporciones indicadas para el peso que compraste." },
  { t: "Aplicalo", d: "Con una capa pareja, siguiendo la guía de aplicación. En GRRR se aplican dos capas: primero la base y después el esmalte superior." },
  { t: "Cocé a cono 5,5–6", d: "Cocé alrededor de 1200 °C en horno eléctrico o a gas, siguiendo la curva recomendada en la guía de temperaturas y conos." },
];

const mistakes = [
  "Cocer a otra temperatura que la indicada: el esmalte no madura bien o se corre.",
  "Aplicar una capa demasiado gruesa o despareja: aparecen chorreados y zonas opacas.",
  "No respetar las proporciones de agua y modificadores del peso comprado.",
  "Aplicar sobre una pieza sucia o con polvo: pueden aparecer burbujas o picaduras.",
];

const glossary = [
  { t: "Gres", d: "Pasta cerámica que se cuece a alta temperatura y queda densa, resistente y poco porosa." },
  { t: "Cono 5–6", d: "Referencia de cocción de unos 1200 °C: el rango de maduración de nuestros esmaltes." },
  { t: "Bizcocho", d: "La pieza después de la primera cocción, lista para esmaltar." },
  { t: "Modificadores", d: "Aditivos incluidos con cada esmalte que mejoran la aplicación y el resultado sobre la pieza." },
];

const faq = [
  {
    q: "¿Qué es un esmalte para gres?",
    a: "Es un esmalte formulado para madurar en el rango de cocción del gres, alrededor de 1200 °C (cono 5–6). A esa temperatura el esmalte se funde y queda integrado a la pieza, con una superficie resistente y duradera.",
  },
  {
    q: "¿Qué esmalte uso para gres?",
    a: "Uno pensado para tu rango de cocción. Los esmaltes SoloGlazes están probados en cono 5,5–6 (1200 °C) y funcionan sobre gres y pastas de alta temperatura en hornos eléctricos y a gas.",
  },
  {
    q: "¿Cuál es la diferencia entre un esmalte de baja y de alta temperatura?",
    a: "La temperatura de cocción. Los esmaltes de alta temperatura, como los de gres, se cuecen alrededor de 1200 °C y dan piezas más densas y resistentes. Nuestros esmaltes son de alta temperatura.",
  },
  {
    q: "¿Sirven como esmalte para vajilla?",
    a: "Sí: son esmaltes pensados para piezas utilitarias y vajilla de uso diario, y la línea Cristalina es apta para lavavajillas una vez cocida correctamente a la temperatura indicada. Si tenés dudas sobre un color o una combinación puntual, escribinos antes de comprar.",
  },
  {
    q: "¿Cómo se prepara el esmalte en polvo?",
    a: "Se diluye con agua y se agregan los modificadores incluidos, siguiendo las proporciones indicadas para cada peso. Los pasos completos están en la Guía de aplicación.",
  },
  {
    q: "¿Puedo probar los colores antes de comprar un kilo?",
    a: "Sí, con el Pack Prueba: cinco esmaltes de 200 g a elección entre las líneas Cristalina y Floating, para probar sobre tu arcilla y en tu horno.",
  },
  {
    q: "¿Sirven para horno eléctrico y a gas?",
    a: "Sí, están probados en hornos eléctricos y a gas en cono 5,5–6.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí, enviamos a toda Argentina desde Buenos Aires. Podés ver los detalles en la página de envíos y devoluciones.",
  },
];

export default async function EsmaltesParaGresPage() {
  let products: Awaited<ReturnType<typeof getProductCards>> = [];
  try {
    products = (await getProductCards(undefined, "es")).filter((p) => p.slug !== "pack-prueba-5x200g");
  } catch {
    products = [];
  }

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Esmaltes para gres", item: absoluteUrl("/esmaltes-para-gres") },
    ],
  };

  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Esmaltes para gres de alta temperatura",
    description: DESCRIPTION,
    url: absoluteUrl("/esmaltes-para-gres"),
    inLanguage: "es",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/producto/${p.slug}`), name: p.name })),
    },
  };

  return (
    <div className="container py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        <Link href="/">Inicio</Link> / Esmaltes para gres
      </nav>

      <h1 className="mb-4 text-h1 lg:text-h1-lg">Esmaltes para gres de alta temperatura (cono 5–6)</h1>
      <p className="mb-8 max-w-3xl text-body-lg text-text-secondary">
        Esmaltes cerámicos en polvo para gres, listos para cocer a cono 5,5–6 (1200 °C) en horno eléctrico o a gas. Hechos en Buenos Aires para
        ceramistas, talleres y escuelas de toda Argentina: modificadores incluidos, proporciones exactas y envíos a todo el país.
      </p>

      {products.length > 0 && (
        <section aria-label="Esmaltes para gres" className="mb-14">
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
        <h2 className="mb-3 text-h2">Esmalte para gres: qué es y para qué sirve</h2>
        <p className="mb-4 text-body leading-relaxed text-text-secondary">
          Un esmalte para gres es un vidriado formulado para madurar a alta temperatura, alrededor de 1200 °C (cono 5–6). Sobre una pieza de gres
          bizcochada, el esmalte se funde durante la cocción y queda integrado a la cerámica: una superficie resistente, duradera y fácil de
          limpiar. Producimos cada esmalte en polvo en nuestro taller de Buenos Aires con materias primas de alta calidad, y lo probamos de forma
          constante para mantener recetas estables y resultados confiables en cada horneada.
        </p>
        <p className="mb-3 text-body text-text-secondary">El cono 5,5–6 es el rango más usado en talleres de Argentina, y nuestros esmaltes se usan en:</p>
        <ul className="mb-10 list-disc space-y-1 pl-5 text-body text-text-secondary">
          {uses.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>

        <h2 className="mb-3 text-h2">Cómo elegir tu esmalte para gres</h2>
        <p className="mb-4 text-body leading-relaxed text-text-secondary">
          Elegí según el efecto que buscás y cómo querés trabajarlo. Todas las líneas se cuecen en el mismo rango (cono 5,5–6), así que podés combinar
          colores en una misma horneada.
        </p>
        <div className="mb-10 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-surface-muted text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th className="px-3 py-2">Línea</th>
                <th className="px-3 py-2">Efecto</th>
                <th className="px-3 py-2">Colores</th>
                <th className="px-3 py-2">Presentación</th>
                <th className="px-3 py-2">Aplicación</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((c) => (
                <tr key={c.slug} className="border-t border-border align-top">
                  <td className="px-3 py-2 font-medium">
                    <Link href={`/catalogo/${c.slug}`} className="text-accent hover:underline">{c.line}</Link>
                  </td>
                  <td className="px-3 py-2 text-text-secondary">{c.effect}</td>
                  <td className="px-3 py-2 text-text-secondary">{c.colors}</td>
                  <td className="px-3 py-2 text-text-secondary">{c.format}</td>
                  <td className="px-3 py-2 text-text-secondary">{c.apply}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-3 text-h2">Esmalte para vajilla</h2>
        <p className="mb-10 text-body leading-relaxed text-text-secondary">
          Si buscás un esmalte para vajilla, nuestras líneas están pensadas para piezas de uso diario: tazas, platos, bowls y fuentes. La línea
          Cristalina es apta para vajilla y lavavajillas cocida correctamente a la temperatura indicada. Para obtener una superficie bien madura y
          resistente, seguí las proporciones y la curva de cocción de la{" "}
          <Link href="/guia/como-aplicar" className="text-accent underline">Guía de aplicación</Link> y la información de{" "}
          <Link href="/guia/temperaturas-y-conos" className="text-accent underline">temperaturas y conos</Link>.
        </p>

        <h2 className="mb-4 text-h2">Cómo aplicar un esmalte para gres en polvo</h2>
        <ol className="mb-6 space-y-3">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[50%] bg-accent-soft text-sm text-accent">{i + 1}</span>
              <p className="text-body text-text-secondary">
                <b className="font-medium text-text-primary">{s.t}.</b> {s.d}
              </p>
            </li>
          ))}
        </ol>
        <h3 className="mb-2 text-h3">Errores comunes</h3>
        <ul className="mb-10 list-disc space-y-1 pl-5 text-body text-text-secondary">
          {mistakes.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>

        <h2 className="mb-3 text-h2">Por qué elegir esmaltes SoloGlazes</h2>
        <p className="mb-3 text-body text-text-secondary">
          Creamos nuestros esmaltes en un taller propio, con pruebas constantes para garantizar un comportamiento estable en hornos eléctricos y a gas.
        </p>
        <ul className="mb-10 list-disc space-y-1 pl-5 text-body text-text-secondary">
          {advantages.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <h2 className="mb-4 text-h2">Glosario rápido</h2>
        <dl className="mb-10 grid gap-3 sm:grid-cols-2">
          {glossary.map((g) => (
            <div key={g.t} className="rounded-lg border border-border p-4">
              <dt className="mb-1 text-body font-medium">{g.t}</dt>
              <dd className="text-sm leading-relaxed text-text-secondary">{g.d}</dd>
            </div>
          ))}
        </dl>

        <h2 className="mb-4 text-h2">Preguntas frecuentes sobre esmaltes para gres</h2>
        <dl className="mb-10 space-y-3">
          {faq.map((f) => (
            <div key={f.q} className="rounded-lg border border-border p-4">
              <dt className="mb-1 text-body font-medium">{f.q}</dt>
              <dd className="text-sm leading-relaxed text-text-secondary">{f.a}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Ver todo el catálogo <ArrowRight size={16} />
          </Link>
          <Link href="/envios-y-devoluciones" className="text-sm text-accent hover:underline">Envíos y devoluciones</Link>
          <Link href="/guia" className="text-sm text-accent hover:underline">Guía del ceramista</Link>
          <Link href="/esmalte-para-vajilla" className="text-sm text-accent hover:underline">Esmalte para vajilla</Link>
          <Link href="/esmalte-ceramico-en-polvo" className="text-sm text-accent hover:underline">Esmalte cerámico en polvo</Link>
        </div>
      </div>
    </div>
  );
}
