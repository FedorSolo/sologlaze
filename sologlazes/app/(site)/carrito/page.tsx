"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export default function CarritoPage() {
  const { lines, updateQty, remove, subtotal } = useCart();
  const [promo, setPromo] = useState("");
  const [comment, setComment] = useState("");

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
        <div className="flex-1 divide-y divide-border">
          {lines.map((line) => (
            <div key={line.slug} className="flex items-center gap-4 py-5">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                {line.imageUrl && <Image src={line.imageUrl} alt={line.name} fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="text-h3">{line.name}</p>
                <p className="text-sm text-text-secondary">
                  $ {line.price.toLocaleString("es-AR")} ARS
                </p>
              </div>
              <div className="flex items-center rounded-full border border-border-strong">
                <button
                  aria-label="Restar"
                  className="flex h-9 w-9 items-center justify-center"
                  onClick={() => updateQty(line.slug, line.quantity - 1)}
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm">{line.quantity}</span>
                <button
                  aria-label="Sumar"
                  className="flex h-9 w-9 items-center justify-center"
                  onClick={() => updateQty(line.slug, line.quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
              <button aria-label="Quitar" onClick={() => remove(line.slug)} className="p-2 text-text-secondary hover:text-status-error">
                <X size={18} />
              </button>
            </div>
          ))}
        </div>

        <aside className="w-full shrink-0 lg:w-80">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="mb-4 flex gap-2">
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="Código de descuento"
                className="h-11 flex-1 rounded-sm border border-border px-3 text-sm"
              />
              <button className="rounded-sm border border-border-strong px-4 text-sm">Aplicar</button>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comentario del pedido (opcional) — por ejemplo, si es para un taller"
              rows={3}
              className="mb-4 w-full rounded-sm border border-border p-3 text-sm"
            />

            <div className="mb-4 flex justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-medium">$ {subtotal.toLocaleString("es-AR")} ARS</span>
            </div>
            <p className="mb-4 text-xs text-text-secondary">El envío se calcula en el checkout.</p>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Finalizar compra <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
