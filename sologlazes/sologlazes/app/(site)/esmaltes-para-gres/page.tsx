import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Esmaltes cerámicos para gres cono 5,5–6 en Argentina",
  description:
    "Esmaltes cerámicos para gres en rango cono 5,5–6, desarrollados en Buenos Aires para ceramistas, talleres, estudios y escuelas de cerámica en toda Argentina.",
};

const uses = [
  "Gres y pastas de alta temperatura",
  "Porcelana",
  "Piezas utilitarias y decorativas",
  "Vajilla de uso diario",
  "Cerámica artística y funcional",
];

const advantages = [
  "Fórmulas estables y repetibles",
  "Cobertura pareja sin chorreados excesivos",
  "Colores profundos y duraderos",
  "Pigmentos de primera calidad",
  "Probados en cono 5,5–6",
  "Compatibles entre sí para combinaciones creativas",
];

export default function EsmaltesParaGresPage() {
  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        Inicio / Esmaltes para GRES
      </nav>

      <div className="max-w-2xl">
        <h1 className="mb-6 text-h1 lg:text-h1-lg">Esmaltes cerámicos para gres cono 5,5–6 en Argentina</h1>
        <p className="mb-8 text-body-lg text-text-secondary">
          En nuestra tienda online encontrás esmaltes cerámicos para gres en rango cono 5,5–6, desarrollados
          especialmente para ceramistas, talleres, estudios y escuelas de cerámica en toda Argentina.
          Producimos nuestros esmaltes en Buenos Aires con materias primas de alta calidad, manteniendo
          recetas estables y resultados confiables en cada horneada.
        </p>

        <h2 className="mb-3 text-h3">Cono 5,5–6: la mejor opción para gres y alta temperatura</h2>
        <ul className="mb-8 list-disc space-y-1 pl-5 text-body text-text-secondary">
          {uses.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>

        <h2 className="mb-3 text-h3">Por qué elegir nuestros esmaltes</h2>
        <p className="mb-3 text-body text-text-secondary">
          Creamos nuestros esmaltes en un taller propio, con pruebas constantes para garantizar un
          comportamiento estable en hornos eléctricos y a gas.
        </p>
        <ul className="mb-10 list-disc space-y-1 pl-5 text-body text-text-secondary">
          {advantages.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>

        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Ver catálogo <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
