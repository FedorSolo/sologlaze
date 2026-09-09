import { GuideArticle } from "@/components/content/guide-article";

export const metadata = {
  title: "Cristalina, Floating o GRRR",
  description: "En qué se diferencian las tres líneas de SoloGlazes y cómo elegir según el efecto que buscás.",
};

export default function ColeccionesGuiaPage() {
  return (
    <GuideArticle title="Cristalina, Floating o GRRR" crumb="Colores y efectos" ctaHref="/catalogo" ctaLabel="Explorar catálogo">
      <p>
        Las tres líneas de SoloGlazes cuecen todas a 1200 °C (cono 5,5), pero el efecto final sobre la pieza
        es muy distinto entre una y otra.
      </p>
      <h2>Cristalina</h2>
      <p>
        Esmaltes de base transparente con cristales que emergen durante la cocción, creando efectos únicos de
        profundidad y movimiento en cada pieza. Colores: Miel, Gris, Rosado-Marrón, Lavanda, Verde.
      </p>
      <h2>Floating</h2>
      <p>
        Esmaltes con pigmentos que &quot;flotan&quot; en la superficie durante el gateo, generando texturas
        orgánicas e irrepetibles en hornos de gres. Colores: Verde, Celeste, Rosa Crema, Menta, Azul, Verde
        Grisáceo, Gris Oscuro.
      </p>
      <h2>GRRR (línea premium)</h2>
      <p>
        Efectos volcánicos y de alta textura, con manchas fluidas que recuerdan al pelaje de un animal
        exótico. Requiere aplicar un esmalte base y un esmalte superior por separado (ver guía de
        aplicación). Colores: Pantera Rosa, Leopardo de los Nieves, Fuego.
      </p>
      <p>
        ¿No estás segura/o cuál elegir? El{" "}
        <a href="/catalogo/pack-prueba-5x200g" className="text-accent">
          Pack Prueba 5x200g
        </a>{" "}
        te permite probar cinco colores (Cristalina o Floating) antes de comprar de a litro.
      </p>
    </GuideArticle>
  );
}
