"use client";

import { useActionState } from "react";
import { updateProductAction, type UpdateProductState } from "@/lib/actions/admin-products";

const initialState: UpdateProductState = {};

type Initial = {
  name: string;
  collectionId: string;
  shortDescription: string;
  description: string;
  applicationInstructions: string;
  price: number;
  isActive: boolean;
  inStock: boolean;
};

export function EditProductForm({
  productId,
  collections,
  initial,
}: {
  productId: string;
  collections: { id: string; name: string }[];
  initial: Initial;
}) {
  const boundAction = updateProductAction.bind(null, productId);
  const [state, formAction, pending] = useActionState(boundAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Nombre" name="name" defaultValue={initial.name} required />

      <label className="block text-sm">
        <span className="mb-1 block text-text-secondary">Serie</span>
        <select name="collectionId" defaultValue={initial.collectionId} required className="h-11 w-full rounded-sm border border-border px-3">
          {collections.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      <Field label="Descripción corta" name="shortDescription" defaultValue={initial.shortDescription} required />

      <label className="block text-sm">
        <span className="mb-1 block text-text-secondary">Descripción completa</span>
        <textarea name="description" defaultValue={initial.description} required rows={4} className="w-full rounded-sm border border-border p-3" />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-text-secondary">Instrucciones de aplicación</span>
        <textarea name="applicationInstructions" defaultValue={initial.applicationInstructions} rows={3} className="w-full rounded-sm border border-border p-3" />
      </label>

      <Field label="Precio (ARS)" name="price" type="number" defaultValue={String(initial.price)} required />

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={initial.isActive} />
          Producto activo (visible en el catálogo)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="inStock" defaultChecked={initial.inStock} />
          En stock
        </label>
      </div>

      {state.error && <p className="text-sm text-status-error">{state.error}</p>}
      {state.success && <p className="text-sm text-status-success">Guardado ✔</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        step={type === "number" ? "0.01" : undefined}
        className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent"
      />
    </label>
  );
}
