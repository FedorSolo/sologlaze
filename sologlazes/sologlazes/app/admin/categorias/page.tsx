import { getCollections } from "@/lib/queries/collections";
import { CategoriasClient } from "@/components/admin/categorias-client";

export default async function AdminCategoriasPage() {
  const collections = await getCollections();

  return (
    <div>
      <h1 className="mb-6 text-h1">Categorías</h1>
      <CategoriasClient collections={collections.map((c) => ({ slug: c.slug, name: c.name }))} />
    </div>
  );
}
