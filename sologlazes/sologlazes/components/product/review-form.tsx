"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { submitReviewAction, type SubmitReviewState } from "@/lib/actions/reviews";

const initialState: SubmitReviewState = {};

export function ReviewForm({ productSlug }: { productSlug: string }) {
  const [state, formAction, pending] = useActionState(submitReviewAction, initialState);
  const [rating, setRating] = useState(5);

  if (state.success) {
    return (
      <p className="rounded-md bg-status-success/10 p-4 text-sm text-status-success">
        ¡Gracias! Tu reseña quedó enviada y se va a publicar apenas la revisemos.
      </p>
    );
  }

  return (
    <form action={formAction} className="rounded-md border border-border p-4">
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="rating" value={rating} />

      <span className="mb-2 block text-sm font-medium">Dejá tu reseña</span>

      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`Calificar con ${n} estrellas`}
            className="text-status-warning"
          >
            <Star size={22} fill={n <= rating ? "currentColor" : "none"} />
          </button>
        ))}
      </div>

      <textarea
        name="comment"
        required
        rows={3}
        placeholder="¿Cómo te fue con este esmalte?"
        className="mb-3 w-full rounded-sm border border-border p-3 text-sm focus:border-accent"
      />

      {state.error && <p className="mb-3 text-sm text-status-error">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Enviando..." : "Enviar reseña"}
      </button>
    </form>
  );
}
