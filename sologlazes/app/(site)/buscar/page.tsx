import { Suspense } from "react";
import { SearchPageClient } from "@/components/catalog/search-page-client";

export const metadata = {
  title: "Buscar",
  description: "Buscá esmaltes por nombre, color o serie en el catálogo de SoloGlazes.",
};

export default function BuscarPage() {
  return (
    <div className="container py-10 lg:py-14">
      <h1 className="mb-6 text-h1 lg:text-h1-lg">Buscar</h1>
      <Suspense fallback={<p className="text-sm text-text-secondary">Cargando...</p>}>
        <SearchPageClient />
      </Suspense>
    </div>
  );
}
