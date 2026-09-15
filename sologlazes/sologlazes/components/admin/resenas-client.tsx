"use client";

import { useActionState } from "react";
import { moderateReviewAction, adminCreateReviewAction, type CreateReviewState } from "@/lib/actions/admin-orders";

const initialState: CreateReviewState = {};

export function ResenasClient({
  reviews,
}: {
  reviews: { id: string; comment: string; status: string; productName: string }[];
}) {
  const [state, formAction, pending] = useActionState(adminCreateReviewAction, initialState);

  return (
    <div className="max-w-2xl space-y-8">
      {reviews.length === 0 ? (
        <p className="text-sm text-text-secondary">Todavía no hay reseñas.</p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 p-4 text-sm">
              <div>
                <p className="font-medium">
                  {r.productName}{" "}
                  <span className="ml-2 rounded-full bg-surface-muted px-2 py-0.5 text-xs text-text-secondary">{r.status}</span>
                </p>
                <p className="text-text-secondary">{r.comment}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <form action={moderateReviewAction.bind(null, r.id, "APPROVED")}>
                  <button className="rounded-full border border-status-success px-3 py-1 text-status-success">Aprobar</button>
                </form>
                <form action={moderateReviewAction.bind(null, r.id, "REJECTED")}>
                  <button className="rounded-full border border-status-error px-3 py-1 text-status-error">Rechazar</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h2 className="mb-4 text-h3">Cargar reseña manualmente</h2>
        <form action={formAction} className="space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-text-secondary">Slug del producto (ej: cristalina-gris)</span>
            <input name="productSlug" required className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-text-secondary">Nombre del cliente (opcional)</span>
            <input name="authorName" className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-text-secondary">Calificación (1 a 5)</span>
            <input name="rating" type="number" min={1} max={5} defaultValue={5} required className="h-11 w-24 rounded-sm border border-border px-3 focus:border-accent" />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-text-secondary">Comentario</span>
            <textarea name="comment" required rows={3} className="w-full rounded-sm border border-border p-3 focus:border-accent" />
          </label>
          {state.error && <p className="text-sm text-status-error">{state.error}</p>}
          {state.success && <p className="text-sm text-status-success">Reseña publicada ✔</p>}
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Publicar reseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
