import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Esmalte para gres de alta temperatura (cono 5–6) — comprar online",
  description:
    "Esmalte cerámico para gres y alta temperatura, cono 5–6 (1200 °C): esmaltes en polvo para vajilla y cerámica artística, hechos en Buenos Aires. Envíos a toda Argentina.",
  alternates: { canonical: absoluteUrl("/esmaltes-para-gres") },
  openGraph: {
    title: "Esmalte para gres de alta temperatura (cono 5–6)",
    description: "Esmaltes cerámicos en polvo para gres, vajilla y alta temperatura. Cristalina, Floating y GRRR. Hechos en Buenos Aires.",
    url: absoluteUrl("/esmaltes-para-gres"),
    type: "website",
  },
};

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

const lines = [
  { slug: "cristalina", name: "Cristalina", text: "Esmalte cerámico para alta temperatura con efecto de cristales abiertos y terminación brillante. Apto para vajilla." },
  { slug: "floating", name: "Floating", text: "Esmalte para gres con manchas flotantes y degradé natural, distinto en cada pieza." },
  { slug: "grrr", name: "GRRR", text: "Texturas vibrantes inspiradas en el pelaje animal, aplicadas en dos capas." },
  { slug: "pack-prueba", name: "Pack Prueba", text: "Cinco esmaltes de 200 g a elección para probar colores en tu propio horno." },
];

const faq = [
  {
    q: "¿Qué es un esmalte cerámico para alta temperatura?",
    a: "Es un esmalte que se cuece alrededor de 1200 °C (cono 5–6) sobre gres o pasta de alta temperatura ya bizcochada. A esa temperatura el esmalte se funde y queda integrado a la pieza, con una superficie resistente y duradera.",
  },
  {
    q: "¿Qué esmalte uso para gres?",
    a: "Un esmalte formulado para el rango de cocción del gres. Los esmaltes SoloGlazes están probados en cono 5,5–6 (1200 °C) y funcionan sobre gres y pastas de alta temperatura en hornos eléctricos y a gas.",
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
    q: "¿Hacen envíos a todo el país?",
    a: "Sí, enviamos a toda Argentina desde Buenos Aires. Podés ver los detalles en la página de envíos y devoluciones.",
  },
];

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

export default function EsmaltesParaGresPage() {
  return (
    <div className="container py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        <Link href="/">Inicio</Link> / Esmaltes para gres
      </nav>

      <div className="max-w-3xl">
        <h1 className="mb-6 text-h1 lg:text-h1-lg">Esmalte para gres de alta temperatura: cono 5–6 en Argentina</h1>
        <p className="mb-8 text-body-lg text-text-secondary">
          En SoloGlazes encontrás esmaltes cerámicos para gres y alta temperatura en rango cono 5,5–6 (1200 °C), desarrollados
          para ceramistas, talleres, estudios y escuelas de cerámica en toda Argentina. Producimos cada esmalte en polvo en
          Buenos Aires con materias primas de alta calidad, manteniendo recetas estables y resultados confiables en cada horneada.
        </p>

        <h2 className="mb-3 text-h3">Cono 5,5–6: la mejor opción para gres y esmalte de alta temperatura</h2>
        <p className="mb-3 text-body text-text-secondary">
          El cono 5,5–6 (alrededor de 1200 °C) es el rango de cocción más usado para gres y pastas de alta temperatura en
          talleres de Argentina. Nuestros esmaltes están formulados para madurar en ese rango y se usan en:
        </p>
        <ul className="mb-8 list-disc space-y-1 pl-5 text-body text-text-secondary">
          {uses.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>

        <h2 className="mb-3 text-h3">Esmalte para vajilla</h2>
        <p className="mb-8 text-body text-text-secondary">
          Si buscás un esmalte para vajilla, nuestras líneas están pensadas para piezas de uso diario: tazas, platos, bowls y
          fuentes. La línea Cristalina es apta para vajilla y lavavajillas cocida correctamente a la temperatura indicada.
          Para obtener una superficie bien madura y resistente, seguí las proporciones y la curva de cocción de la{" "}
          <Link href="/guia/como-aplicar" className="text-accent underline">Guía de aplicación</Link> y la información de{" "}
          <Link href="/guia/temperaturas-y-conos" className="text-accent underline">temperaturas y conos</Link>.
        </p>

        <h2 className="mb-3 text-h3">Nuestras líneas de esmaltes para gres</h2>
        <ul className="mb-8 grid gap-3 sm:grid-cols-2">
          {lines.map((l) => (
            <li key={l.slug}>
              <Link href={`/catalogo/${l.slug}`} className="block h-full rounded-lg border border-border p-4 transition-shadow hover:shadow-md">
                <p className="mb-1 text-body font-medium">{l.name}</p>
                <p className="text-sm text-text-secondary">{l.text}</p>
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="mb-3 text-h3">Por qué elegir nuestros esmaltes</h2>
        <p className="mb-3 text-body text-text-secondary">
          Creamos nuestros esmaltes en un taller propio, con pruebas constantes para garantizar un comportamiento estable en
          hornos eléctricos y a gas.
        </p>
        <ul className="mb-10 list-disc space-y-1 pl-5 text-body text-text-secondary">
          {advantages.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <h2 className="mb-4 text-h3">Preguntas frecuentes sobre esmaltes para gres</h2>
        <dl className="mb-10 space-y-3">
          {faq.map((f) => (
            <div key={f.q} className="rounded-lg border border-border p-4">
              <dt className="mb-1 text-body font-medium">{f.q}</dt>
              <dd className="text-sm leading-relaxed text-text-secondary">{f.a}</dd>
            </div>
          ))}
        </dl>

        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Ver catálogo de esmaltes <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
