import { SeoLanding, landingMetadata, type LandingConfig } from "@/components/pages/seo-landing";

export const revalidate = 60;

const config: LandingConfig = {
  path: "/esmalte-para-vajilla",
  title: "Esmalte para vajilla de alta temperatura (cono 5–6) — comprar online",
  description:
    "Esmalte cerámico para vajilla: Cristalina, apto para vajilla y lavavajillas cocido a cono 5–6 (1200 °C). En polvo, con modificadores. Hecho en Buenos Aires, envíos a toda Argentina.",
  h1: "Esmalte para vajilla: cerámica de alta temperatura para tazas, platos y bowls",
  breadcrumb: "Esmalte para vajilla",
  intro:
    "Si buscás un esmalte para vajilla de gres, la línea Cristalina de SoloGlazes es apta para vajilla y lavavajillas una vez cocida correctamente a cono 5–6 (1200 °C). Es un esmalte cerámico en polvo, hecho en Buenos Aires, con modificadores incluidos y proporciones exactas para cada peso.",
  collections: ["cristalina"],
  sections: [
    {
      h2: "Esmalte para vajilla: qué tener en cuenta",
      paragraphs: [
        "Para vajilla conviene un esmalte de alta temperatura bien madurado: a cono 5–6 el esmalte se funde y queda integrado a la pieza, con una superficie densa, resistente y fácil de limpiar. Por eso la cocción a la temperatura indicada es lo más importante para un buen resultado.",
        "Cristalina es la línea de SoloGlazes que indicamos como apta para vajilla y lavavajillas, cocida correctamente a la temperatura recomendada. Si querés usar otro esmalte de nuestro catálogo en piezas que van a estar en contacto con alimentos, escribinos antes de comprar y te orientamos.",
      ],
    },
    {
      h2: "Para qué piezas sirve",
      list: ["Tazas y jarros", "Platos y fuentes", "Bowls y cuencos", "Sets de mesa y piezas utilitarias de gres", "Piezas decorativas del mismo juego"],
    },
    {
      h2: "Cómo lograr una vajilla bien esmaltada",
      list: [
        "Usá una pieza de gres o pasta de alta temperatura bizcochada y limpia, sin polvo ni grasa.",
        "Preparalo con agua y los modificadores incluidos, respetando las proporciones del peso que compraste.",
        "Aplicá una capa pareja, sin zonas muy gruesas.",
        "Cocé a cono 5,5–6 (alrededor de 1200 °C), siguiendo la curva de la guía de temperaturas y conos.",
      ],
      ordered: true,
    },
    {
      h2: "Colores de Cristalina para vajilla",
      paragraphs: [
        "Cristalina deja una terminación brillante con efecto de cristales abiertos, distinta en cada cocción. Está disponible en Miel, Gris, Rosado-Marrón, Lavanda y Verde, en presentaciones de 500 g y 1 kg. Para probar sin comprar un kilo podés armar tu Pack Prueba con cinco esmaltes de 200 g.",
      ],
    },
  ],
  faq: [
    { q: "¿Qué esmalte sirve para vajilla?", a: "Un esmalte de alta temperatura bien cocido, que quede maduro y bien integrado a la pieza. La línea Cristalina de SoloGlazes es apta para vajilla y lavavajillas cocida correctamente a cono 5–6." },
    { q: "¿Se puede usar la vajilla esmaltada en el lavavajillas?", a: "Con Cristalina, cocida correctamente a la temperatura indicada, sí: es apta para vajilla y lavavajillas." },
    { q: "¿A qué temperatura se cuece un esmalte para vajilla?", a: "Nuestros esmaltes se cuecen a cono 5–6, alrededor de 1200 °C, sobre gres o pasta de alta temperatura bizcochada." },
    { q: "¿Los demás esmaltes de SoloGlazes sirven para vajilla?", a: "Cristalina es la línea que indicamos como apta para vajilla y lavavajillas. Si querés usar otro color o línea en piezas para alimentos, escribinos y te asesoramos antes de comprar." },
    { q: "¿Puedo probar el esmalte antes de comprar un kilo?", a: "Sí, con el Pack Prueba: cinco esmaltes de 200 g a elección entre las líneas Cristalina y Floating." },
  ],
  related: [{ href: "/guia/como-aplicar", label: "Guía de aplicación" }, { href: "/guia/temperaturas-y-conos", label: "Temperaturas y conos" }],
};

export const metadata = landingMetadata(config);

export default function Page() {
  return <SeoLanding c={config} />;
}
