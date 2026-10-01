"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCart, parseWeightKg } from "@/lib/cart-context";

export type ProductCardData = {
  id: string;
  variantId: string;
  variantLabel?: string;
  slug: string;
  name: string;
  collection: { slug: "cristalina" | "floating" | "grrr"; name: string };
  temperatureLabel: string;
  price: number;
  compareAtPrice?: number;
  variantPrices?: { id: string; label: string; price: number }[];
  currency?: string;
  imageUrl: string;
  imageAltUrl?: string;
  imageAlt: string;
  inStock: boolean;
  stockQuantity?: number;
};

const collectionColor: Record<string, string> = {
  cristalina: "text-collection-cristalina",
  floating: "text-collection-floating",
  grrr: "text-collection-grrr",
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const href = `/producto/${product.slug}`;

  // Si hay más de un peso, el comprador puede elegir cuál agregar sin entrar a la ficha.
  const hasWeights = !!product.variantPrices && product.variantPrices.length > 1;
  const [selectedVariantId, setSelectedVariantId] = useState(product.variantId);
  const selected = hasWeights ? product.variantPrices!.find((v) => v.id === selectedVariantId) : undefined;
  const addPrice = selected?.price ?? product.price;
  const addLabel = selected?.label ?? product.variantLabel;
  const canBuy = product.inStock && !!selectedVariantId;

  const handleAdd = () => {
    add(
      {
        variantId: selectedVariantId,
        slug: product.slug,
        name: product.name,
        variantLabel: addLabel,
        price: addPrice,
        imageUrl: product.imageUrl,
      },
      1,
      parseWeightKg(addLabel)
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      className="group min-w-0 transition-transform duration-200 hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface-muted">
            <Image
              src={hovered && product.imageAltUrl ? product.imageAltUrl : product.imageUrl}
              alt={product.imageAlt}
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
              className={`object-cover transition-opacity duration-300 ${product.inStock ? "" : "opacity-60"}`}
            />
            <span
              className={`absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-surface/90 px-2.5 py-1 text-caption uppercase tracking-wide sm:left-3 sm:top-3 ${
                collectionColor[product.collection.slug] ?? ""
              }`}
            >
              {product.collection.name}
            </span>
            {!product.inStock && (
              <span className="absolute bottom-2 left-2 rounded-full bg-text-primary px-2.5 py-1 text-caption uppercase text-surface sm:bottom-3 sm:left-3">
                Agotado
              </span>
            )}
          </div>
        </Link>

        {canBuy && (
          <button
            type="button"
            aria-label={`Agregar ${product.name}${addLabel ? ` (${addLabel})` : ""} al carrito`}
            onClick={handleAdd}
            className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-[50%] bg-accent text-white shadow-md ring-2 ring-white transition-all hover:scale-110 hover:bg-accent-hover hover:shadow-lg sm:bottom-3 sm:right-3"
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>
        )}
      </div>

      <div className="px-1 pt-3">
        <Link href={href} className="block">
          <h3 className="text-base font-normal leading-snug sm:text-h3">{product.name}</h3>
          <p className="mt-0.5 text-small text-text-secondary">{product.temperatureLabel}</p>
        </Link>

        {hasWeights ? (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {product.variantPrices!.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVariantId(v.id)}
                aria-pressed={v.id === selectedVariantId}
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors sm:text-sm ${
                  v.id === selectedVariantId
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border text-text-primary/70 hover:border-accent hover:bg-accent-soft/50 hover:text-accent"
                }`}
              >
                {v.label} · $ {v.price.toLocaleString("es-AR")}
              </button>
            ))}
          </div>
        ) : (
          <Link href={href} className="block">
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-base sm:text-body-lg">
              <span>
                $ {product.price.toLocaleString("es-AR")} {product.currency ?? "ARS"}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-text-secondary line-through">$ {product.compareAtPrice.toLocaleString("es-AR")}</span>
              )}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
}
