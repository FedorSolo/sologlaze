"use client";

import { useActionState } from "react";
import { updateProductAction, type UpdateProductState } from "@/lib/actions/admin-products";
import { MultiImageUploadField } from "@/components/admin/multi-image-upload-field";
import { VideoUploadField } from "@/components/admin/video-upload-field";

const initialState: UpdateProductState = {};

type VariantInitial = {
  id: string;
  label: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
};

type Initial = {
  name: string;
  collectionId: string;
  shortDescription: string;
  description: string;
  applicationInstructions: string;
  isActive: boolean;
  variants: VariantInitial[];
  imageUrls?: string[];
  videoUrl?: string;
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

      <div>
        <span className="mb-2 block text-sm text-text-secondary">Presentaciones (precio y stock por peso)</span>
        <div className="space-y-3 rounded-md border border-border p-3">
          {initial.variants.map((v, i) => (
            <div key={v.id} className="grid grid-cols-3 gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="col-span-3 text-sm font-medium">{v.label}</div>
              <input type="hidden" name={`variantId_${i}`} value={v.id} />
              <label className="block text-xs">
                <span className="mb-1 block text-text-secondary">Precio nuevo (ARS)</span>
                <input
                  name={`variantPrice_${i}`}
                  type="number"
                  step="0.01"
                  defaultValue={String(v.price)}
                  required
                  className="h-10 w-full rounded-sm border border-border px-2 focus:border-accent"
                />
              </label>
              <label className="block text-xs">
                <span className="mb-1 block text-text-secondary">Precio anterior (tachado)</span>
                <input
                  name={`variantCompareAtPrice_${i}`}
                  type="number"
                  step="0.01"
                  defaultValue={v.compareAtPrice ? String(v.compareAtPrice) : ""}
                  className="h-10 w-full rounded-sm border border-border px-2 focus:border-accent"
                />
              </label>
              <label className="block text-xs">
                <span className="mb-1 block text-text-secondary">Stock (unidades)</span>
                <input
                  name={`variantStock_${i}`}
                  type="number"
                  defaultValue={String(v.stockQuantity)}
                  required
                  className="h-10 w-full rounded-sm border border-border px-2 focus:border-accent"
                />
              </label>
            </div>
          ))}
        </div>
        <input type="hidden" name="variantCount" value={initial.variants.length} />
      </div>

      <MultiImageUploadField name="images" label="Fotos del producto" defaultUrls={initial.imageUrls} />
      <VideoUploadField name="videoUrl" label="Video del producto (opcional)" defaultUrl={initial.videoUrl} />

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isActive" defaultChecked={initial.isActive} />
        Producto activo (visible en el catálogo)
      </label>

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
