"use client";

import { useActionState } from "react";
import { createProductAction, type CreateProductState } from "@/lib/actions/admin-products";
import { MultiImageUploadField } from "@/components/admin/multi-image-upload-field";
import { VideoUploadField } from "@/components/admin/video-upload-field";

const initialState: CreateProductState = {};

export function NewProductForm({ collections }: { collections: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createProductAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Nombre" name="name" required />

      <label className="block text-sm">
        <span className="mb-1 block text-text-secondary">Serie</span>
        <select name="collectionId" required className="h-11 w-full rounded-sm border border-border px-3">
          <option value="">Elegir...</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>

      <Field label="Descripción corta (para la tarjeta del catálogo)" name="shortDescription" required />

      <label className="block text-sm">
        <span className="mb-1 block text-text-secondary">Descripción completa</span>
        <textarea name="description" required rows={4} className="w-full rounded-sm border border-border p-3" />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block text-text-secondary">Instrucciones de aplicación (opcional)</span>
        <textarea name="applicationInstructions" rows={3} className="w-full rounded-sm border border-border p-3" />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Presentación (ej: 0.5 kg)" name="variantLabel" defaultValue="0.5 kg" required />
        <Field label="Precio (ARS)" name="price" type="number" required />
      </div>

      <MultiImageUploadField name="images" label="Fotos del producto" />
      <VideoUploadField name="videoUrl" label="Video del producto (opcional)" />

      {state.error && <p className="text-sm text-status-error">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Creando..." : "Crear producto"}
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
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-text-secondary">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        step={type === "number" ? "0.01" : undefined}
        className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent"
      />
    </label>
  );
}
