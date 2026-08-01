import Link from "next/link";
import { ArrowRight } from "lucide-react";

const guides = [
  {
    href: "/guia/temperaturas-y-conos",
    title: "Temperaturas y conos",
    desc: "Qué significa cono 5,5, y el programa de cocción real que usamos.",
  },
  {
    href: "/guia/superficies",
    title: "Cristalina, Floating o GRRR",
    desc: "En qué se diferencian las tres líneas y cómo elegir según el efecto que buscás.",
  },
  {
    href: "/guia/como-aplicar",
    title: "Cómo aplicar el esmalte",
    desc: "Proporciones de preparación reales y programa de cocción, tabla por tabla.",
  },
];

export const metadata = {
  title: "Guía para elegir tu esmalte",
  description: "Guías simples para elegir el esmalte cerámico correcto según tu horno, tu pieza y el efecto que buscás.",
};

export default function GuiaIndexPage() {
  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        Inicio / Guía
      </nav>
      <h1 className="mb-3 text-h1 lg:text-h1-lg">No sé qué elegir</h1>
      <p className="mb-10 max-w-xl text-body-lg text-text-secondary">
        Antes de mirar el catálogo, respondé estas preguntas — te van a ahorrar tiempo y una compra equivocada.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {guides.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="group rounded-lg border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <h2 className="mb-2 text-h3">{g.title}</h2>
            <p className="mb-4 text-sm text-text-secondary">{g.desc}</p>
            <span className="inline-flex items-center gap-1 text-sm text-accent">
              Leer <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
