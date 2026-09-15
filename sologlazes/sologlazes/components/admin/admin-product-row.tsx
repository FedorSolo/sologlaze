"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, Pencil } from "lucide-react";
import { quickUpdatePriceStock } from "@/lib/actions/admin-products";

type Variant = {
  id: string;
  label: string;
  price: number;
  stockQuantity: number;
  inStock: boolean;
};

type Props = {
  slug: string;
  name: string;
  collectionName: string;
  variants: Variant[];
};

export function AdminProductRow({ slug, name, collectionName, variants }: Props) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id);
  const selected = variants.find((v) => v.id === selectedId) ?? variants[0];

  const [editing, setEditing] = useState(false);
  const [priceValue, setPriceValue] = useState(String(selected?.price ?? 0));
  const [stockValue, setStockValue] = useState(String(selected?.stockQuantity ?? 0));
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  if (!selected) return null;

  const selectVariant = (id: string) => {
    setSelectedId(id);
    const v = variants.find((x) => x.id === id);
    setPriceValue(String(v?.price ?? 0));
    setStockValue(String(v?.stockQuantity ?? 0));
    setEditing(false);
  };

  const startEdit = () => {
    setPriceValue(String(selected.price));
    setStockValue(String(selected.stockQuantity));
    setEditing(true);
  };

  const save = () => {
    setError(null);
    const p = Number(priceValue);
    const s = Number(stockValue);
    startTransition(async () => {
      try {
        await quickUpdatePriceStock(selected.id, p, s);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al guardar");
      }
    });
  };

  const effectiveInStock = editing ? Number(stockValue) > 0 : selected.inStock;

  return (
    <tr>
      <td className="py-3">{name}</td>
      <td className="py-3 text-text-secondary">{collectionName}</td>
      <td className="py-3">
        {variants.length > 1 ? (
          <select
            value={selectedId}
            onChange={(e) => selectVariant(e.target.value)}
            className="h-8 rounded-sm border border-border px-2 text-sm"
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        ) : (
          <span className="text-text-secondary">{selected.label}</span>
        )}
      </td>
      <td className="py-3">
        {editing ? (
          <input
            type="number"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            className="h-8 w-24 rounded-sm border border-accent px-2"
            autoFocus
          />
        ) : (
          <button onClick={startEdit} className="hover:underline">
            $ {selected.price.toLocaleString("es-AR")}
          </button>
        )}
      </td>
      <td className="py-3 text-text-secondary">
        {editing ? (
          <input
            type="number"
            value={stockValue}
            onChange={(e) => setStockValue(e.target.value)}
            className="h-8 w-20 rounded-sm border border-accent px-2"
          />
        ) : (
          <button onClick={startEdit} className="hover:underline">
            {selected.stockQuantity} u.
          </button>
        )}
      </td>
      <td className="py-3">
        <span className={`rounded-full px-2 py-1 text-xs ${effectiveInStock ? "bg-status-success/10 text-status-success" : "bg-status-error/10 text-status-error"}`}>
          {effectiveInStock ? "En stock" : "Agotado"}
        </span>
      </td>
      <td className="py-3 text-right">
        {editing ? (
          <div className="flex items-center justify-end gap-3">
            {error && <span className="text-xs text-status-error">{error}</span>}
            <button
              onClick={save}
              disabled={pending}
              className="flex items-center gap-1 text-accent disabled:opacity-60"
            >
              <Check size={14} /> {pending ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => setEditing(false)} className="text-text-secondary">
              Cancelar
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end gap-3">
            {saved && <span className="text-xs text-status-success">Guardado ✓</span>}
            <button onClick={startEdit} className="flex items-center gap-1 text-text-secondary hover:text-accent" aria-label="Edición rápida">
              <Pencil size={13} />
            </button>
            <Link href={`/admin/productos/${slug}/editar`} className="text-accent">
              Editar
            </Link>
          </div>
        )}
      </td>
    </tr>
  );
}
