import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Cómo aplicar el esmalte",
  description: "Proporciones de preparación y programa de cocción reales para los esmaltes SoloGlazes.",
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

export default function ComoAplicarPage() {
  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        <Link href="/">Inicio</Link> / <Link href="/guia">Guía</Link> / Cómo aplicar
      </nav>

      <div className="max-w-2xl">
        <h1 className="mb-6 text-h1 lg:text-h1-lg">Proporciones de preparación para esmaltes</h1>

        <h2 className="mb-2 mt-8 text-h3">Programa de cocción en horno</h2>
        <ul className="mb-8 list-disc space-y-1 pl-5 text-body text-text-secondary">
          <li>2,5 °C/min hasta 1100 °C</li>
          <li>1 °C/min hasta 1200 °C</li>
        </ul>

        {tables.map((t) => (
          <div key={t.title} className="mb-8">
            <h2 className="mb-1 text-h3">{t.title}</h2>
            <p className="mb-3 text-sm text-text-secondary">Colores: {t.colors}</p>
            <table className="w-full text-left text-sm">
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
        ))}

        <h2 className="mb-3 mt-10 text-h3">Instrucciones de aplicación — Serie GRRR</h2>
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

        <Link
          href="/catalogo"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Ver esmaltes <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
