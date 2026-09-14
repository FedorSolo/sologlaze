import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getCollections } from "@/lib/queries/collections";

export const revalidate = 60;

const collectionAccent: Record<string, string> = {
  cristalina: "bg-collection-cristalina",
  floating: "bg-collection-floating",
  grrr: "bg-collection-grrr",
};

export default async function HomePage() {
  const collections = await getCollections();

  return (
    <>
      <h1 className="sr-only">SoloGlazes — Esmaltes cerámicos listos para usar, cono 5–6</h1>

      {/* Hero — imagen a pantalla completa, sin texto encima */}
      <section className="relative -mt-px h-[60vh] w-full overflow-hidden lg:h-[85vh]">
        <Image
          src="/images/hero.jpg"
          alt="Pieza cerámica terminada con esmalte SoloGlazes, mostrando textura y brillo tras la cocción"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="object-cover"
        />
      </section>

      <section className="container flex flex-col items-center gap-4 py-10 text-center lg:py-14">
        <span className="rounded-full bg-accent-soft px-4 py-1.5 text-caption uppercase tracking-wide text-accent">
          Cono 5–6 · 1200°C · Listos para usar
        </span>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white transition-colors hover:bg-accent-hover">
            Ver catálogo <ArrowRight size={18} />
          </Link>
          <Link href="/guia" className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 transition-colors hover:bg-surface-muted">
            No sé qué elegir
          </Link>
        </div>
      </section>

      {/* Colecciones */}
      <section className="container py-16 lg:py-24">
        <h2 className="mb-10 text-h2 lg:text-h2-lg">Nuestras líneas</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogo/${c.slug}`}
              className="group overflow-hidden rounded-lg border border-border bg-surface transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
                <Image
                  src={c.heroImageUrl}
                  alt={`Piezas de cerámica con esmaltes de la línea ${c.name}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className={`mb-4 h-1 w-10 rounded-full ${collectionAccent[c.slug] ?? "bg-accent"}`} />
                <h3 className="mb-2 text-h3">{c.name}</h3>
                <p className="mb-4 text-body text-text-secondary">{c.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-accent">
                  Explorar <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="container pb-24">
        <div className="flex flex-col items-center gap-4 rounded-lg bg-text-primary px-6 py-16 text-center text-bg">
          <h2 className="text-h2 lg:text-h2-lg">¿Tenés dudas antes de comprar?</h2>
          <p className="max-w-md text-body text-bg/80">
            Escribinos por WhatsApp — te ayudamos a elegir el esmalte según tu horno y tu pieza.
          </p>
          <a
            href="https://wa.me/5491127379589"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white transition-colors hover:bg-accent-hover"
          >
            <MessageCircle size={18} /> Escribir por WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
