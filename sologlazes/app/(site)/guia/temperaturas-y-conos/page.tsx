import { GuideArticle } from "@/components/content/guide-article";

export const metadata = {
  title: "Temperaturas y conos de cocción",
  description: "Qué significa cono 5,5 (1200°C) y el programa de cocción real que usa SoloGlazes.",
};

export default function TemperaturasPage() {
  return (
    <GuideArticle
      title="Temperaturas y conos"
      crumb="Temperaturas y conos"
      ctaHref="/catalogo"
      ctaLabel="Ver esmaltes"
    >
      <p>
        En cerámica, la temperatura de cocción no se mide solo en grados: se habla de <strong>conos
        pirométricos</strong>, que indican cuánto calor absorbió realmente la pieza (no solo la temperatura
        del aire dentro del horno).
      </p>
      <h2>¿Qué es cono 5,5?</h2>
      <p>
        Es el rango en el que trabajan todos los esmaltes SoloGlazes: <strong>1200 °C</strong>. El programa
        de cocción recomendado por la marca es: 2,5 °C/min hasta 1100 °C, seguido de 1 °C/min hasta 1200 °C.
        Es el estándar de gres (stoneware) en Argentina.
      </p>
      <h2>¿Cómo sé a qué cono cuece mi horno?</h2>
      <ul>
        <li>Revisá la ficha técnica de tu horno — suele indicar el cono máximo.</li>
        <li>Usá conos pirométricos de control dentro de la cámara para confirmar.</li>
        <li>Si comprás una pieza de segunda mano o de una escuela, preguntá directamente qué cono usan.</li>
      </ul>
      <p>
        Si tu horno no llega a cono 5,5, escribinos por WhatsApp antes de comprar — te ayudamos a evitar una
        compra que no vas a poder cocer.
      </p>
    </GuideArticle>
  );
}
