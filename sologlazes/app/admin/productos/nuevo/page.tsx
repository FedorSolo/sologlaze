import { getCollections } from "@/lib/queries/collections";
import { NewProductForm } from "@/components/admin/new-product-form";

export default async function NewProductPage() {
  const collections = await getCollections();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-h1">Nuevo producto</h1>
      <NewProductForm collections={collections.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
