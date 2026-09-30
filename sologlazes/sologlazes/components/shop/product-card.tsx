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
  variantPrices?: { label: string; price: number }[];
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
  const canBuy = product.inStock && !!product.variantId;
  const href = `/producto/${product.slug}`;

  const handleAdd = () => {
    add(
      {
        variantId: product.variantId,
        slug: product.slug,
        name: product.name,
        variantLabel: product.variantLabel,
        price: product.price,
        imageUrl: product.imageUrl,
      },
      1,
      parseWeightKg(product.variantLabel)
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
            aria-label={`Agregar ${product.name} al carrito`}
            onClick={handleAdd}
            className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover sm:bottom-3 sm:right-3"
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
          </button>
        )}
      </div>

      <Link href={href} className="block px-1 pt-3">
        <h3 className="text-base font-normal leading-snug sm:text-h3">{product.name}</h3>
        <p className="mt-0.5 text-small text-text-secondary">
          {product.temperatureLabel}
          {product.variantLabel ? ` · ${product.variantLabel}` : ""}
        </p>
        {product.variantPrices && product.variantPrices.length > 1 ? (
          <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-sm sm:text-base">
            {product.variantPrices.map((v) => (
              <span key={v.label} className="whitespace-nowrap">
                {v.label}{" "}
                <span className="font-medium">$ {v.price.toLocaleString("es-AR")}</span>
              </span>
            ))}
          </p>
        ) : (
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-base sm:text-body-lg">
            <span>
              $ {product.price.toLocaleString("es-AR")} {product.currency ?? "ARS"}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-text-secondary line-through">$ {product.compareAtPrice.toLocaleString("es-AR")}</span>
            )}
          </p>
        )}
      </Link>
    </div>
  );
}
