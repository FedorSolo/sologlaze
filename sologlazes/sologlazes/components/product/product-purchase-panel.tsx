"use client";

import { useState, useTransition } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import type { ProductDetail } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";
import { toggleFavoriteAction } from "@/lib/actions/favorites";

const collectionTextColor: Record<string, string> = {
  cristalina: "text-collection-cristalina",
  floating: "text-collection-floating",
  grrr: "text-collection-grrr",
};

export function ProductPurchasePanel({ product, initialFavorited = false }: { product: ProductDetail; initialFavorited?: boolean }) {
  const [qty, setQty] = useState(1);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [added, setAdded] = useState(false);
  const [pending, startTransition] = useTransition();
  const { add } = useCart();
  const variants = product.variants ?? [];
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id);
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const displayPrice = selectedVariant?.price ?? product.price;

  const handleFavorite = () => {
    setFavorited((f) => !f); // optimista
    startTransition(async () => {
      try {
        await toggleFavoriteAction(product.slug);
      } catch {
        setFavorited((f) => !f); // revertir si falla (p. ej. sin sesión)
      }
    });
  };

  const handleAdd = () => {
    add(
      {
        slug: product.slug,
        name: selectedVariant ? `${product.name} (${selectedVariant.label})` : product.name,
        price: displayPrice,
        imageUrl: product.images[0]?.url ?? "",
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div>
      <p className={`mb-1 text-h3 uppercase tracking-wide ${collectionTextColor[product.collection.slug] ?? "text-accent"}`}>{product.collection.name}</p>
      <h1 className="mb-2 text-h1 lg:text-h1-lg">{product.name}</h1>
      <p className="mb-4 text-body-lg text-text-secondary">{product.shortDescription}</p>
      <p className="mb-6 text-h2">
        $ {displayPrice.toLocaleString("es-AR")} {product.currency}
      </p>

      {variants.length > 1 && (
        <div className="mb-4 flex gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariantId(v.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                v.id === selectedVariantId ? "border-accent bg-accent-soft text-accent" : "border-border text-text-secondary"
              }`}
            >
              {v.label} — $ {v.price.toLocaleString("es-AR")}
            </button>
          ))}
        </div>
      )}

      {!product.inStock ? (
        <span className="mb-6 inline-block rounded-full bg-status-error/10 px-3 py-1 text-sm text-status-error">
          Agotado — dejanos tu email y te avisamos
        </span>
      ) : (
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center rounded-full border border-border-strong">
            <button
              aria-label="Restar"
              className="flex h-10 w-10 items-center justify-center"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm">{qty}</span>
            <button
              aria-label="Sumar"
              className="flex h-10 w-10 items-center justify-center"
              onClick={() => setQty((q) => q + 1)}
            >
              <Plus size={14} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {added ? "Agregado ✓" : "Agregar al carrito"}
          </button>

          <button
            aria-label="Agregar a favoritos"
            onClick={handleFavorite}
            disabled={pending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border-strong disabled:opacity-60"
          >
            <Heart size={18} fill={favorited ? "currentColor" : "none"} className={favorited ? "text-accent" : ""} />
          </button>
        </div>
      )}

      <details className="mb-3 border-t border-border py-4" open>
        <summary className="cursor-pointer text-sm font-medium">Características</summary>
        <dl className="mt-3 space-y-2">
          {product.attributes.map((a) => (
            <div key={a.label} className="flex justify-between text-sm">
              <dt className="text-text-secondary">{a.label}</dt>
              <dd className="text-right font-medium">{a.value}</dd>
            </div>
          ))}
        </dl>
      </details>

      <details className="border-t border-b border-border py-4">
        <summary className="cursor-pointer text-sm font-medium">Instrucciones de aplicación</summary>
        <p className="mt-3 text-sm text-text-secondary">{product.applicationInstructions}</p>
      </details>
    </div>
  );
}
