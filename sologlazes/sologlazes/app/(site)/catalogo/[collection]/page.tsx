import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getCollections, getCollectionBySlug } from "@/lib/queries/collections";
import { getProductCards, getFilterGroups } from "@/lib/queries/products";

// Texto SEO específico por línea — contenido real para el buscador, no relleno genérico.
// Vive abajo de la grilla de productos, donde no estorba la experiencia de compra.
const seoText: Record<string, { heading: string; paragraphs: string[] }> = {
  cristalina: {
    heading: "Esmaltes Cristalina para cerámica en Argentina",
    paragraphs: [
      "La línea Cristalina de SoloGlazes son esmaltes cerámicos en polvo para cono 5–6 (1200 °C) que desarrollan un efecto de cristales abiertos sobre la superficie de la pieza, con una terminación brillante única en cada cocción. Vienen en los colores Miel, Gris, Rosado-Marrón, Lavanda y Verde, con sus modificadores incluidos para lograr el efecto cristalino correctamente.",
      "Son esmaltes aptos para vajilla y lavavajillas, pensados para ceramistas en Argentina que buscan un acabado decorativo con carácter propio, sin depender de importaciones ni de fórmulas de mezcla complicadas: las proporciones de agua y modificador vienen detalladas para cada peso.",
    ],
  },
  floating: {
    heading: "Esmaltes Floating para cerámica en Argentina",
    paragraphs: [
      "Floating es la línea de esmaltes cerámicos de SoloGlazes con efecto de manchas flotantes y degradé natural, ideal para piezas de gres y cerámica artística cocidas a cono 5–6 (1200 °C). Está disponible en Verde, Verde Grisáceo, Celeste, Azul, Gris Oscuro, Menta y Rosa Crema.",
      "Cada esmalte Floating es en polvo, se prepara con agua según proporciones exactas y trae sus modificadores incluidos. Es una opción buscada por talleres y ceramistas de Buenos Aires y de todo el país que quieren un efecto orgánico y variable, distinto en cada pieza.",
    ],
  },
  grrr: {
    heading: "Esmaltes GRRR para cerámica en Argentina",
    paragraphs: [
      "GRRR es la línea de esmaltes cerámicos más expresiva de SoloGlazes: texturas vibrantes y manchas fluidas inspiradas en el pelaje animal, para piezas de cerámica con mucho carácter, cocidas a cono 5–6 (1200 °C). Incluye los colores Fuego, Leopardo de las Nieves y Pantera Rosa.",
      "Se aplican en dos capas (base y esmalte superior) con los modificadores correspondientes a cada frasco. Es la serie elegida por ceramistas que buscan un efecto decorativo fuerte y diferenciado dentro del catálogo de esmaltes para gres en Argentina.",
    ],
  },
  "pack-prueba": {
    heading: "Pack Prueba de esmaltes cerámicos SoloGlazes",
    paragraphs: [
      "El Pack Prueba de SoloGlazes incluye cinco esmaltes cerámicos de 200g a elección, de cualquier color de las líneas Cristalina y Floating (no incluye GRRR). Es la forma más económica de probar distintos efectos y colores antes de comprar un esmalte de 500g o 1kg.",
      "Pensado para ceramistas que recién empiezan a trabajar con los esmaltes SoloGlazes en Buenos Aires y en toda Argentina, o que quieren testear una combinación nueva de colores antes de aplicarla en una pieza grande.",
    ],
  },
};

export const revalidate = 60; // re-consulta la base cada 60s como máximo, no queda "congelado" hasta el próximo deploy

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection: collectionSlug } = await params;
  const collection = await getCollectionBySlug(collectionSlug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
    alternates: { canonical: `https://sologlazes.com.ar/catalogo/${collection.slug}` },
    openGraph: {
      title: collection.name,
      description: collection.description,
      images: collection.heroImageUrl ? [collection.heroImageUrl] : undefined,
      url: `https://sologlazes.com.ar/catalogo/${collection.slug}`,
    },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const { collection: collectionSlug } = await params;
  const collection = await getCollectionBySlug(collectionSlug);
  if (!collection) notFound();

  const [products, filterGroups] = await Promise.all([
    getProductCards(collectionSlug),
    getFilterGroups(),
  ]);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://sologlazes.com.ar" },
      { "@type": "ListItem", position: 2, name: "Catálogo", item: "https://sologlazes.com.ar/catalogo" },
      { "@type": "ListItem", position: 3, name: collection.name, item: `https://sologlazes.com.ar/catalogo/${collection.slug}` },
    ],
  };

  return (
    <div className="container py-10 lg:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        <Link href="/">Inicio</Link> / <Link href="/catalogo">Catálogo</Link> / {collection.name}
      </nav>
      <h1 className="mb-2 text-h1 lg:text-h1-lg">{collection.name}</h1>
      <p className="mb-8 max-w-xl text-body-lg text-text-secondary">{collection.description}</p>
      <CatalogBrowser products={products} filterGroups={filterGroups} />

      {seoText[collection.slug] && (
        <section className="mt-16 max-w-2xl border-t border-border pt-8 text-sm text-text-secondary">
          <h2 className="mb-3 text-h3 text-text-primary">{seoText[collection.slug].heading}</h2>
          {seoText[collection.slug].paragraphs.map((p, i) => (
            <p key={i} className="mb-3 leading-relaxed">
              {p}
            </p>
          ))}
        </section>
      )}
    </div>
  );
}
