"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, Plus } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export type ProductCardData = {
  slug: string;
  name: string;
  collection: { slug: "cristalina" | "floating" | "grrr"; name: string };
  temperatureLabel: string;
  price: number;
  currency?: string;
  imageUrl: string;
  imageAltUrl?: string;
  imageAlt: string;
  inStock: boolean;
};

const collectionColor: Record<string, string> = {
  cristalina: "text-collection-cristalina",
  floating: "text-collection-floating",
  grrr: "text-collection-grrr",
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const [hovered, setHovered] = useState(false);
  const { add } = useCart();

  return (
    <div
      className="group rounded-md bg-surface transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface-muted">
          <Image
            src={hovered && product.imageAltUrl ? product.imageAltUrl : product.imageUrl}
            alt={product.imageAlt}
            fill
            className={`object-cover transition-opacity duration-300 ${product.inStock ? "" : "opacity-60"}`}
          />
          <span className={`absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-caption uppercase tracking-wide ${collectionColor[product.collection.slug]}`}>
            {product.collection.name}
          </span>
          <button
            aria-label="Agregar a favoritos"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 hover:bg-surface"
            onClick={(e) => e.preventDefault()}
          >
            <Heart size={16} />
          </button>
          {!product.inStock && (
            <span className="absolute bottom-3 left-3 rounded-full bg-text-primary px-2.5 py-1 text-caption uppercase text-surface">
              Agotado
            </span>
          )}
        </div>

        <div className="flex items-end justify-between gap-2 px-1 py-3">
          <div>
            <h3 className="text-h3">{product.name}</h3>
            <p className="text-small text-text-secondary">
              {product.temperatureLabel}
            </p>
            <p className="mt-1 text-body-lg">
              $ {product.price.toLocaleString("es-AR")} {product.currency ?? "ARS"}
            </p>
          </div>
          <button
            aria-label="Agregar al carrito"
            disabled={!product.inStock}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-40"
            onClick={(e) => {
              e.preventDefault();
              add({ slug: product.slug, name: product.name, price: product.price, imageUrl: product.imageUrl });
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </Link>
    </div>
  );
}
