import { SeoLanding, landingMetadata, type LandingConfig } from "@/components/pages/seo-landing";

export const revalidate = 60;

const config: LandingConfig = {
  path: "/esmalte-ceramico-en-polvo",
  title: "Esmalte cerámico en polvo de alta temperatura (cono 5–6) — comprar online",
  description:
    "Esmalte cerámico en polvo para gres, cono 5–6 (1200 °C): Cristalina, Floating y GRRR. Modificadores incluidos, proporciones exactas, 500 g y 1 kg. Envíos a toda Argentina.",
  h1: "Esmalte cerámico en polvo para alta temperatura: Cristalina, Floating y GRRR",
  breadcrumb: "Esmalte cerámico en polvo",
  intro:
    "Todos nuestros esmaltes cerámicos se venden en polvo, listos para preparar con agua. Están formulados para cono 5–6 (1200 °C), con modificadores incluidos y proporciones exactas para cada peso, así que no hay que adivinar cantidades ni mezclar fórmulas complicadas. Hechos en Buenos Aires, con envíos a toda Argentina.",
  sections: [
    {
      h2: "Por qué un esmalte cerámico en polvo",
      paragraphs: [
        "El esmalte en polvo es más práctico de guardar y transportar, dura más que uno líquido ya preparado y te permite preparar solo la cantidad que vas a usar. Preparás el esmalte con agua cuando lo necesitás y mantenés el polvo sin usar en su envase.",
        "Con SoloGlazes, cada envase indica cuánta agua usar y trae los modificadores incluidos, para que el resultado sea estable y repetible en cada preparación.",
      ],
    },
    {
      h2: "Cómo se prepara el esmalte en polvo",
      list: [
        "Medí el agua según la proporción indicada para el peso del envase.",
        "Agregá el polvo y los modificadores incluidos.",
        "Mezclá bien hasta que no queden grumos y colá si lo necesitás.",
        "Aplicá sobre la pieza bizcochada y cocé a cono 5,5–6.",
      ],
      ordered: true,
    },
    {
      h2: "Presentaciones y líneas",
      list: [
        "Cristalina: cristales abiertos y terminación brillante. 500 g y 1 kg. Apto para vajilla y lavavajillas cocido correctamente.",
        "Floating: manchas flotantes y degradé natural. 500 g y 1 kg.",
        "GRRR: texturas de pelaje animal, en dos capas (base y esmalte superior).",
        "Pack Prueba: cinco esmaltes de 200 g a elección, para probar colores.",
      ],
    },
    {
      h2: "Para qué materiales y hornos",
      paragraphs: [
        "Son esmaltes para gres y pastas de alta temperatura, probados en hornos eléctricos y a gas en cono 5,5–6 (alrededor de 1200 °C).",
      ],
    },
  ],
  faq: [
    { q: "¿Qué es un esmalte cerámico en polvo?", a: "Es un esmalte que se vende seco y se prepara con agua antes de aplicarlo. Es más práctico de guardar y permite preparar solo lo que vas a usar." },
    { q: "¿Cuánta agua lleva el esmalte en polvo?", a: "Depende del peso del envase. Las proporciones de agua y modificadores vienen detalladas para cada peso y están explicadas en la Guía de aplicación." },
    { q: "¿A qué temperatura se cuece?", a: "A cono 5–6, alrededor de 1200 °C, sobre gres o pasta de alta temperatura bizcochada." },
    { q: "¿Qué presentaciones hay?", a: "Cristalina y Floating se venden en 500 g y 1 kg. También hay un Pack Prueba con cinco esmaltes de 200 g a elección." },
    { q: "¿Hacen envíos a todo el país?", a: "Sí, enviamos a toda Argentina desde Buenos Aires." },
  ],
  related: [{ href: "/guia/como-aplicar", label: "Guía de aplicación" }],
};

export const metadata = landingMetadata(config);

export default function Page() {
  return <SeoLanding c={config} />;
}
