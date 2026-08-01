import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MessageCircle } from "lucide-react";
import { getCollections } from "@/lib/queries/collections";

const collectionAccent: Record<string, string> = {
  cristalina: "bg-collection-cristalina",
  floating: "bg-collection-floating",
  grrr: "bg-collection-grrr",
};

export default async function HomePage() {
  const collections = await getCollections();

  return (
    <>
      {/* Hero */}
      <section className="container flex flex-col items-center gap-8 pb-16 pt-12 text-center lg:pb-24 lg:pt-20">
        <span className="rounded-full bg-accent-soft px-4 py-1.5 text-caption uppercase tracking-wide text-accent">
          Cono 5–6 · 1200°C · Listos para usar
        </span>
        <h1 className="max-w-3xl text-display font-display lg:text-display-lg">
          No vendemos esmalte. Vendemos el resultado que imaginaste.
        </h1>
        <p className="max-w-xl text-body-lg text-text-secondary">
          Esmaltes cerámicos listos para aplicar, sin tamizar ni mezclar. El efecto que ves
          en la pieza terminada es exactamente lo que vas a lograr en la tuya.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/catalogo" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-white transition-colors hover:bg-accent-hover">
            Ver catálogo <ArrowRight size={18} />
          </Link>
          <Link href="/guia" className="inline-flex items-center gap-2 rounded-full border border-border-strong px-6 py-3 transition-colors hover:bg-surface-muted">
            No sé qué elegir
          </Link>
        </div>
        <div className="relative mt-4 aspect-video w-full max-w-4xl overflow-hidden rounded-lg bg-surface-muted">
          <Image
            src="/images/hero-placeholder.jpg"
            alt="Pieza cerámica terminada con esmalte SoloGlazes, mostrando textura y brillo tras la cocción"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Colecciones */}
      <section className="container py-16 lg:py-24">
        <h2 className="mb-10 text-h2 lg:text-h2-lg">Tres líneas, tres resultados</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/catalogo/${c.slug}`}
              className="group rounded-lg border border-border bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className={`mb-4 h-1 w-10 rounded-full ${collectionAccent[c.slug] ?? "bg-accent"}`} />
              <h3 className="mb-2 text-h3">{c.name}</h3>
              <p className="mb-4 text-body text-text-secondary">{c.description}</p>
              <span className="inline-flex items-center gap-1 text-sm text-accent">
                Explorar <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-surface-muted py-16 lg:py-24">
        <div className="container">
          <h2 className="mb-10 text-h2 lg:text-h2-lg">Simple, de principio a fin</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Elegí el efecto", text: "Filtrá por temperatura, superficie o color y mirá el resultado real en la galería." },
              { step: "2", title: "Aplicá sin preparación", text: "Listo para usar — sin tamizar, sin mezclar, sin prueba y error." },
              { step: "3", title: "Horneá a cono 5–6", text: "1200°C y obtenés exactamente el efecto que viste en la foto." },
            ].map((s) => (
              <div key={s.step}>
                <span className="mb-3 block font-display text-h2 text-accent">{s.step}</span>
                <h3 className="mb-2 text-h3">{s.title}</h3>
                <p className="text-body text-text-secondary">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galería preview */}
      <section className="container py-16 lg:py-24">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-h2 lg:text-h2-lg">Piezas de nuestra comunidad</h2>
          <Link href="/galeria" className="hidden text-sm text-accent sm:inline-flex items-center gap-1">
            Ver galería <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-md bg-surface-muted">
              <Image
                src={`/images/gallery-placeholder-${i}.jpg`}
                alt="Pieza cerámica de un cliente terminada con esmalte SoloGlazes"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
        <Link href="/galeria" className="mt-6 inline-flex items-center gap-1 text-sm text-accent sm:hidden">
          Ver galería <ArrowRight size={14} />
        </Link>
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
