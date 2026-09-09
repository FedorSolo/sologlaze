import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog/catalog-browser";
import { getProductCards, getFilterGroups } from "@/lib/queries/products";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Todos los esmaltes cerámicos SoloGlazes — filtrá por temperatura, superficie y efecto.",
};

export default async function CatalogoPage() {
  const [products, filterGroups] = await Promise.all([getProductCards(), getFilterGroups()]);

  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        Inicio / Catálogo
      </nav>
      <h1 className="mb-8 text-h1 lg:text-h1-lg">Catálogo</h1>
      <CatalogBrowser products={products} filterGroups={filterGroups} />
    </div>
  );
}
