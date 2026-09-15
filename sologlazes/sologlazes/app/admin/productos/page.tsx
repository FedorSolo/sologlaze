import Link from "next/link";
import { Plus } from "lucide-react";
import { getProductCards } from "@/lib/queries/products";
import { AdminProductRow } from "@/components/admin/admin-product-row";

export default async function AdminProductosPage() {
  const products = await getProductCards();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-h1">Productos</h1>
        <Link href="/admin/productos/nuevo" className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm text-white">
          <Plus size={16} /> Nuevo producto
        </Link>
      </div>

      <p className="mb-3 text-xs text-text-secondary">
        Clic en el precio o el stock para editarlos directamente, sin abrir el producto.
      </p>

      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-text-secondary">
          <tr>
            <th className="py-2 font-medium">Nombre</th>
            <th className="py-2 font-medium">Serie</th>
            <th className="py-2 font-medium">Precio</th>
            <th className="py-2 font-medium">Stock</th>
            <th className="py-2 font-medium">Estado</th>
            <th className="py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p) => (
            <AdminProductRow
              key={p.slug}
              id={p.id}
              slug={p.slug}
              name={p.name}
              collectionName={p.collection.name}
              price={p.price}
              stockQuantity={p.stockQuantity}
              inStock={p.inStock}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
