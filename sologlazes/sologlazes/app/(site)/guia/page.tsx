import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";
import { GuideScrollHints } from "@/components/content/guide-scroll-hints";

export const metadata = {
  title: "Guía del ceramista: temperaturas y conos, cómo aplicar el esmalte y proporciones",
  description:
    "Todo en una página: cono 5,5–6 (1200 °C) y programa de cocción, proporciones de agua y modificadores para preparar el esmalte, video de aplicación y diferencias entre Cristalina, Floating y GRRR.",
  alternates: { canonical: absoluteUrl("/guia") },
};

const tables = [
  {
    title: "Cristalina",
    colors: "Miel, Gris, Rosado-Marrón, Lavanda, Verde",
    rows: [
      { amount: "500 g", water: "Entre 280 y 350 (según método)", mod1: "60", mod2: "10" },
      { amount: "1 kg", water: "Entre 560 y 700 (según método)", mod1: "120", mod2: "20" },
    ],
  },
  {
    title: "Floating — Verde, Verde Grisáceo",
    colors: "Verde, Verde Grisáceo",
    rows: [
      { amount: "500 g", water: "Entre 225 y 300 (según método)", mod1: "60", mod2: "10" },
      { amount: "1 kg", water: "Entre 450 y 600 (según método)", mod1: "120", mod2: "20" },
    ],
  },
  {
    title: "Floating — Celeste, Azul, Gris Oscuro, Menta, Rosa Crema",
    colors: "Celeste, Azul, Gris Oscuro, Menta, Rosa Crema",
    rows: [
      { amount: "500 g", water: "Entre 280 y 350 (según método)", mod1: "60", mod2: "10" },
      { amount: "1 kg", water: "Entre 560 y 700 (según método)", mod1: "120", mod2: "20" },
    ],
  },
];

const nav = [
  { href: "#video", label: "Video" },
  { href: "#temperaturas-y-conos", label: "Temperaturas y conos" },
  { href: "#como-aplicar", label: "Cómo aplicar" },
  { href: "#proporciones", label: "Proporciones" },
  { href: "#cristalina-floating-grrr", label: "Cristalina, Floating o GRRR" },
];

const sectionCls = "scroll-mt-24 border-t border-border pt-10 mt-12";

export default function GuiaPage() {
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Guía", item: absoluteUrl("/guia") },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: "Cómo mezclar los esmaltes SoloGlazes",
      description: "Video de preparación y mezcla de esmaltes cerámicos de alta temperatura SoloGlazes.",
      embedUrl: "https://www.youtube.com/embed/Gu6luGOo1vA",
      thumbnailUrl: "https://img.youtube.com/vi/Gu6luGOo1vA/hqdefault.jpg",
      uploadDate: "2026-01-01",
    },
  ];

  return (
    <div className="container py-10 lg:py-14">
      {ld.map((o, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />
      ))}
      <GuideScrollHints />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        <Link href="/">Inicio</Link> / Guía
      </nav>

      <div className="max-w-2xl">
        <h1 className="mb-3 text-h1 lg:text-h1-lg">Guía del ceramista</h1>
        <p className="mb-6 text-body-lg text-text-secondary">
          Todo lo que necesitás para usar los esmaltes SoloGlazes en una sola página: a qué temperatura se
          cuecen, cómo prepararlos, cómo aplicarlos y qué efecto da cada línea.
        </p>

        <section id="video" className="mb-8 scroll-mt-24">
          <h2 className="mb-3 text-h2">Video: cómo mezclar los esmaltes</h2>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface-muted">
            <iframe
              src="https://www.youtube.com/embed/Gu6luGOo1vA"
              title="Cómo mezclar los esmaltes SoloGlazes"
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        <nav aria-label="Contenido" className="flex flex-wrap gap-2">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent">
              {n.label}
            </a>
          ))}
        </nav>

        {/* 1. Temperaturas y conos */}
        <section id="temperaturas-y-conos" className={sectionCls}>
          <h2 className="mb-4 text-h2">Temperaturas y conos de cocción</h2>
          <div className="space-y-4 text-body text-text-secondary">
            <p>
              En cerámica, la temperatura de cocción no se mide solo en grados: se habla de{" "}
              <strong className="text-text-primary">conos pirométricos</strong>, que indican cuánto calor
              absorbió realmente la pieza (no solo la temperatura del aire dentro del horno).
            </p>
            <h3 className="text-h3 text-text-primary">¿Qué es cono 5,5?</h3>
            <p>
              Es el rango en el que trabajan todos los esmaltes SoloGlazes:{" "}
              <strong className="text-text-primary">1200 °C</strong>. Es el estándar de gres (stoneware) en
              Argentina.
            </p>
            <h3 className="text-h3 text-text-primary">Programa de cocción recomendado</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>2,5 °C/min hasta 1100 °C</li>
              <li>1 °C/min hasta 1200 °C</li>
            </ul>
            <h3 className="text-h3 text-text-primary">¿Cómo sé a qué cono cuece mi horno?</h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Revisá la ficha técnica de tu horno: suele indicar el cono máximo.</li>
              <li>Usá conos pirométricos de control dentro de la cámara para confirmar.</li>
              <li>Si trabajás en un taller o escuela, preguntá directamente qué cono usan.</li>
            </ul>
          </div>
        </section>

        {/* 2. Cómo aplicar */}
        <section id="como-aplicar" className={sectionCls}>
          <h2 className="mb-4 text-h2">Cómo aplicar el esmalte</h2>
          <ol className="list-decimal space-y-4 pl-5 text-body text-text-secondary">
            <li>
              <strong className="text-text-primary">Preparación.</strong> Diluí el esmalte en polvo con agua y
              agregá los modificadores según la tabla de proporciones de más abajo. Mezclá hasta obtener una
              consistencia homogénea.
            </li>
            <li>
              <strong className="text-text-primary">Aplicación.</strong> Aplicá sobre una pieza bizcochada y
              limpia, en capas parejas. Esperá a que cada capa esté seca antes de aplicar la siguiente.
            </li>
            <li>
              <strong className="text-text-primary">Cocción.</strong> Cocé a cono 5,5 (1200 °C) con el programa
              de cocción de la sección anterior.
            </li>
          </ol>

          <h3 className="mb-2 mt-8 text-h3">Serie GRRR: base y esmalte superior</h3>
          <ol className="list-decimal space-y-4 pl-5 text-body text-text-secondary">
            <li>
              <strong className="text-text-primary">Preparación de los esmaltes.</strong> Diluí los esmaltes
              Base y superior con agua, agregando los modificadores según las proporciones de la tabla
              Floating. Prepará cada uno por separado, sin mezclarlos entre sí, hasta obtener una consistencia
              homogénea.
            </li>
            <li>
              <strong className="text-text-primary">Aplicación de la base.</strong> Aplicá dos capas cubritivas
              del esmalte base, cubriendo la superficie de manera uniforme. Asegurate de que cada capa esté
              completamente seca antes de aplicar la siguiente.
            </li>
            <li>
              <strong className="text-text-primary">Aplicación del esmalte superior.</strong> Una vez seca la
              base, aplicá dos o tres capas del esmalte superior. Dejá secar bien cada capa para evitar disolver
              o adelgazar las anteriores.
            </li>
          </ol>
        </section>

        {/* 3. Proporciones */}
        <section id="proporciones" className={sectionCls}>
          <h2 className="mb-2 text-h2">Proporciones de preparación</h2>
          <p className="mb-6 text-sm text-text-secondary">Agua y modificadores en ml, según el peso de esmalte en polvo.</p>
          {tables.map((t) => (
            <div key={t.title} className="mb-8">
              <h3 className="mb-1 text-h3">{t.title}</h3>
              <p className="mb-3 text-sm text-text-secondary">Colores: {t.colors}</p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="border-b border-border text-text-secondary">
                    <tr>
                      <th className="py-2 pr-4 font-medium">Cantidad</th>
                      <th className="py-2 pr-4 font-medium">Agua (ml)</th>
                      <th className="py-2 pr-4 font-medium">Modificador 1 (ml)</th>
                      <th className="py-2 font-medium">Modificador 2 (ml)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {t.rows.map((r) => (
                      <tr key={r.amount}>
                        <td className="py-2 pr-4 font-medium">{r.amount}</td>
                        <td className="py-2 pr-4 text-text-secondary">{r.water}</td>
                        <td className="py-2 pr-4 text-text-secondary">{r.mod1}</td>
                        <td className="py-2 text-text-secondary">{r.mod2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        {/* 5. Líneas (al final, para indexación) */}
        <section id="cristalina-floating-grrr" className={sectionCls}>
          <h2 className="mb-4 text-h2">Cristalina, Floating o GRRR</h2>
          <div className="space-y-4 text-body text-text-secondary">
            <p>
              Las tres líneas de SoloGlazes cuecen todas a 1200 °C (cono 5,5), pero el efecto final sobre la
              pieza es muy distinto entre una y otra.
            </p>
            <h3 className="text-h3 text-text-primary">Cristalina</h3>
            <p>
              Esmaltes de base transparente con cristales que emergen durante la cocción, creando efectos únicos
              de profundidad y movimiento en cada pieza. Colores: Miel, Gris, Rosado-Marrón, Lavanda, Verde.
            </p>
            <h3 className="text-h3 text-text-primary">Floating</h3>
            <p>
              Esmaltes con pigmentos que &quot;flotan&quot; en la superficie durante el gateo, generando texturas
              orgánicas e irrepetibles en hornos de gres. Colores: Verde, Celeste, Rosa Crema, Menta, Azul,
              Verde Grisáceo, Gris Oscuro.
            </p>
            <h3 className="text-h3 text-text-primary">GRRR (línea premium)</h3>
            <p>
              Efectos volcánicos y de alta textura, con manchas fluidas que recuerdan al pelaje de un animal
              exótico. Requiere aplicar un esmalte base y un esmalte superior por separado (ver Cómo aplicar).
              Colores: Pantera Rosa, Leopardo de los Nieves, Fuego.
            </p>
            <p>
              ¿No estás segura/o cuál elegir? El{" "}
              <Link href="/catalogo/pack-prueba" className="text-accent hover:underline">Pack Prueba 5x200g</Link>{" "}
              te permite probar cinco colores (Cristalina o Floating) antes de comprar de a litro.
            </p>
          </div>
          <Link
            href="/catalogo"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Ver esmaltes <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
}
