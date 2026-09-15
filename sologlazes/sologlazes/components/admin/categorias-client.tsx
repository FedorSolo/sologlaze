"use client";

import { useActionState } from "react";
import { createCollectionAction, type CreateCollectionState } from "@/lib/actions/admin-collections";

const initialState: CreateCollectionState = {};

export function CategoriasClient({ collections }: { collections: { slug: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(createCollectionAction, initialState);

  return (
    <div className="max-w-xl space-y-8">
      <div className="divide-y divide-border rounded-lg border border-border">
        {collections.map((c) => (
          <div key={c.slug} className="flex items-center justify-between p-4 text-sm">
            <span className="font-medium">{c.name}</span>
            <span className="text-text-secondary">/{c.slug}</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-h3">Nueva categoría</h2>
        <form action={formAction} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-text-secondary">Nombre</span>
            <input name="name" required className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-text-secondary">Descripción</span>
            <textarea name="description" required rows={3} className="w-full rounded-sm border border-border p-3 focus:border-accent" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-text-secondary">Foto de portada (URL, opcional — se puede subir después en Subir imagen)</span>
            <input name="heroImageUrl" placeholder="/images/..." className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent" />
          </label>
          {state.error && <p className="text-sm text-status-error">{state.error}</p>}
          {state.success && <p className="text-sm text-status-success">Categoría creada ✔</p>}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? "Creando..." : "Crear categoría"}
          </button>
        </form>
      </div>
    </div>
  );
}
