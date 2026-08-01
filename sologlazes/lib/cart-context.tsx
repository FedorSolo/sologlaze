"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ProductCardData } from "@/components/shop/product-card";

export type CartLine = {
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  add: (product: Pick<ProductCardData, "slug" | "name" | "price" | "imageUrl">, qty?: number) => void;
  updateQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sologlazes:cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // localStorage no disponible (SSR / modo privado) — se ignora, carrito arranca vacío
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add: CartContextValue["add"] = (product, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === product.slug);
      if (existing) {
        return prev.map((l) => (l.slug === product.slug ? { ...l, quantity: l.quantity + qty } : l));
      }
      return [...prev, { slug: product.slug, name: product.name, price: product.price, imageUrl: product.imageUrl, quantity: qty }];
    });
  };

  const updateQty = (slug: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, quantity: qty } : l))));
  };

  const remove = (slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug));
  const clear = () => setLines([]);

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <CartContext.Provider value={{ lines, add, updateQty, remove, clear, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
