"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { QuickOrderForm } from "@/components/catalog/quick-order-form";
import { PackPruebaPicker } from "@/components/catalog/pack-prueba-picker";

export default function CarritoPage() {
  const { lines, updateQty, remove, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag size={32} className="text-text-secondary" />
        <h1 className="text-h2">Tu carrito está vacío</h1>
        <p className="max-w-xs text-sm text-text-secondary">
          Explorá el catálogo y encontrá el esmalte para tu próxima pieza.
        </p>
        <Link href="/catalogo" className="mt-2 rounded-full bg-accent px-6 py-3 text-sm text-white">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10 lg:py-14">
      <h1 className="mb-8 text-h1 lg:text-h1-lg">Carrito</h1>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="min-w-0 flex-1 divide-y divide-border">
          {lines.map((line) => (
            <div key={line.variantId} className="flex gap-4 py-5">
              <Link href={`/producto/${line.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                <Image src={line.imageUrl || "/images/placeholder.jpg"} alt={line.name} fill sizes="80px" className="object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/producto/${line.slug}`} className="block text-base leading-snug">
                      {line.name}
                    </Link>
                    {line.variantLabel && <p className="text-sm text-text-secondary">{line.variantLabel}</p>}
                    <p className="text-sm text-text-secondary">$ {line.price.toLocaleString("es-AR")} c/u</p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Quitar ${line.name}`}
                    onClick={() => remove(line.variantId)}
                    className="-mr-2 -mt-1 shrink-0 p-2 text-text-secondary hover:text-status-error"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border border-border-strong">
                    <button
                      type="button"
                      aria-label="Restar"
                      className="flex h-9 w-9 items-center justify-center"
                      onClick={() => updateQty(line.variantId, line.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm">{line.quantity}</span>
                    <button
                      type="button"
                      aria-label="Sumar"
                      className="flex h-9 w-9 items-center justify-center"
                      onClick={() => updateQty(line.variantId, line.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-medium">$ {(line.price * line.quantity).toLocaleString("es-AR")}</span>
                </div>

                {line.slug === "pack-prueba-5x200g" && <PackPruebaPicker variantId={line.variantId} initialNote={line.note} />}
              </div>
            </div>
          ))}
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="rounded-lg border border-border bg-surface p-6 lg:sticky lg:top-28">
            <div className="mb-4 flex justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-medium">$ {subtotal.toLocaleString("es-AR")} ARS</span>
            </div>
            <p className="mb-4 text-xs text-text-secondary">El envío se define en el checkout.</p>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Finalizar compra <ArrowRight size={16} />
            </Link>

            <div className="my-4 flex items-center gap-3 text-xs text-text-secondary">
              <div className="h-px flex-1 bg-border" /> o <div className="h-px flex-1 bg-border" />
            </div>

            <QuickOrderForm />
          </div>
        </aside>
      </div>
    </div>
  );
}
