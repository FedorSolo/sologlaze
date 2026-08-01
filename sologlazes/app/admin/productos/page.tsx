import Link from "next/link";
import { Plus } from "lucide-react";
import { getProductCards } from "@/lib/queries/products";

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

      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-text-secondary">
          <tr>
            <th className="py-2 font-medium">Nombre</th>
            <th className="py-2 font-medium">Serie</th>
            <th className="py-2 font-medium">Precio</th>
            <th className="py-2 font-medium">Estado</th>
            <th className="py-2 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p) => (
            <tr key={p.slug}>
              <td className="py-3">{p.name}</td>
              <td className="py-3 text-text-secondary">{p.collection.name}</td>
              <td className="py-3">$ {p.price.toLocaleString("es-AR")}</td>
              <td className="py-3">
                <span className={`rounded-full px-2 py-1 text-xs ${p.inStock ? "bg-status-success/10 text-status-success" : "bg-status-error/10 text-status-error"}`}>
                  {p.inStock ? "En stock" : "Agotado"}
                </span>
              </td>
              <td className="py-3 text-right">
                <Link href={`/admin/productos/${p.slug}/editar`} className="text-accent">
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
