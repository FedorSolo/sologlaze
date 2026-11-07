import { SeoLanding, landingMetadata, type LandingConfig } from "@/components/pages/seo-landing";

export const revalidate = 60;

const config: LandingConfig = {
  path: "/esmaltes-para-ceramica",
  title: "Esmaltes para cerámica de alta temperatura — comprar online en Argentina",
  description:
    "Comprá esmaltes para cerámica en polvo, de alta temperatura (cono 5–6, 1200 °C): Cristalina, Floating, GRRR y Pack Prueba. Hechos en Buenos Aires, envíos a toda Argentina.",
  h1: "Esmaltes para cerámica de alta temperatura: comprar online en Argentina",
  breadcrumb: "Esmaltes para cerámica",
  intro:
    "SoloGlazes fabrica en Buenos Aires esmaltes para cerámica en polvo, de alta temperatura, para ceramistas, talleres y escuelas. Cuatro opciones para cono 5–6 (1200 °C), con modificadores incluidos y proporciones exactas: Cristalina, Floating, GRRR y un Pack Prueba para probar colores.",
  includePack: true,
  sections: [
    {
      h2: "Cómo elegir tus esmaltes para cerámica",
      list: [
        "Cristalina: efecto de cristales abiertos, terminación brillante, apta para vajilla y lavavajillas cocida correctamente.",
        "Floating: manchas flotantes y degradé natural, distinto en cada pieza.",
        "GRRR: texturas inspiradas en el pelaje animal, aplicadas en dos capas.",
        "Pack Prueba: cinco esmaltes de 200 g a elección para probar antes de comprar 500 g o 1 kg.",
      ],
    },
    {
      h2: "Esmaltes para cerámica de alta temperatura",
      paragraphs: [
        "Todos nuestros esmaltes están pensados para cono 5–6, alrededor de 1200 °C, sobre gres y pastas de alta temperatura bizcochadas, en hornos eléctricos y a gas. A esa temperatura el esmalte madura y queda integrado a la pieza, con una superficie resistente y duradera.",
        "Si recién empezás, la Guía de aplicación y la información de temperaturas y conos explican cómo preparar el esmalte, cuántas capas aplicar y cómo cocer.",
      ],
    },
    {
      h2: "Qué incluye cada compra",
      list: [
        "Esmalte en polvo, listo para preparar con agua.",
        "Modificadores incluidos, sin comprarlos aparte.",
        "Proporciones de agua detalladas para cada peso.",
        "Envío a toda Argentina desde Buenos Aires.",
      ],
    },
  ],
  faq: [
    { q: "¿Qué esmaltes para cerámica venden?", a: "Esmaltes en polvo de alta temperatura para cono 5–6: Cristalina, Floating y GRRR, además de un Pack Prueba de cinco esmaltes de 200 g a elección." },
    { q: "¿Para qué tipo de cerámica sirven?", a: "Para gres y pastas de alta temperatura bizcochadas, en piezas utilitarias y decorativas, cocidas a cono 5,5–6." },
    { q: "¿Sirven para hornos eléctricos y a gas?", a: "Sí, están probados en hornos eléctricos y a gas en cono 5,5–6." },
    { q: "¿Cómo empiezo si es mi primera vez?", a: "Un buen comienzo es el Pack Prueba, para probar colores en tu propia arcilla y tu horno, junto con la Guía de aplicación." },
    { q: "¿Hacen envíos?", a: "Sí, enviamos a toda Argentina desde Buenos Aires." },
  ],
  related: [{ href: "/catalogo", label: "Catálogo completo" }, { href: "/guia", label: "Guía del ceramista" }],
};

export const metadata = landingMetadata(config);

export default function Page() {
  return <SeoLanding c={config} />;
}
