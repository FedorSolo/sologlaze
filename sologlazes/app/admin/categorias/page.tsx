import { getCollections } from "@/lib/queries/collections";

export default async function AdminCategoriasPage() {
  const collections = await getCollections();

  return (
    <div>
      <h1 className="mb-6 text-h1">Categorías</h1>
      <div className="divide-y divide-border rounded-lg border border-border">
        {collections.map((c) => (
          <div key={c.slug} className="flex items-center justify-between p-4 text-sm">
            <span className="font-medium">{c.name}</span>
            <span className="text-text-secondary">/{c.slug}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-text-secondary">
        CRUD completo (crear/editar/reordenar) se conecta a Collection en Prisma — ver 04-ER-Diagram.md.
      </p>
    </div>
  );
}
