"use client";

import { createContext, useContext, useEffect, useState } from "react";

// Cada línea del carrito es una PRESENTACIÓN concreta (peso) de un producto, identificada por variantId.
// Así 0.5 kg y 1 kg del mismo esmalte son líneas distintas, cada una con su precio.
export type CartLine = {
  variantId: string;
  slug: string;
  name: string; // nombre del producto (sin el peso)
  variantLabel?: string; // "0.5 kg", "1 kg"...
  price: number;
  imageUrl: string;
  quantity: number;
  weightKg?: number;
  note?: string; // ej: elección de 5 esmaltes del Pack Prueba
};

export type CartAddItem = {
  variantId: string;
  slug: string;
  name: string;
  variantLabel?: string;
  price: number;
  imageUrl: string;
};

type CartContextValue = {
  lines: CartLine[];
  add: (item: CartAddItem, qty?: number, weightKg?: number) => void;
  updateQty: (variantId: string, qty: number) => void;
  setNote: (variantId: string, note: string) => void;
  remove: (variantId: string) => void;
  clear: () => void;
  subtotal: number;
  totalWeightKg: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sologlazes:cart:v2";

// Intenta extraer el peso en kg de una etiqueta de variante tipo "0.5 kg", "1 kg" o "200 g".
// Si no matchea nada (ej. "Frasco"), devuelve undefined — ese producto no suma al umbral de envío gratis.
export function parseWeightKg(label: string | undefined | null): number | undefined {
  if (!label) return undefined;
  const kgMatch = label.match(/([\d.,]+)\s*kg/i);
  if (kgMatch) return parseFloat(kgMatch[1].replace(",", "."));
  const gMatch = label.match(/([\d.,]+)\s*g\b/i);
  if (gMatch) return parseFloat(gMatch[1].replace(",", ".")) / 1000;
  return undefined;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLines(parsed.filter((l): l is CartLine => l && typeof l.variantId === "string" && l.variantId.length > 0));
        }
      }
    } catch {
      // localStorage no disponible (SSR / modo privado) — se ignora, carrito arranca vacío
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // sin persistencia — el carrito sigue funcionando en memoria
    }
  }, [lines, hydrated]);

  const add: CartContextValue["add"] = (item, qty = 1, weightKg) => {
    if (!item.variantId) return;
    setLines((prev) => {
      const existing = prev.find((l) => l.variantId === item.variantId);
      if (existing) {
        return prev.map((l) => (l.variantId === item.variantId ? { ...l, quantity: l.quantity + qty } : l));
      }
      return [...prev, { ...item, quantity: qty, weightKg }];
    });
  };

  const updateQty = (variantId: string, qty: number) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => l.variantId !== variantId) : prev.map((l) => (l.variantId === variantId ? { ...l, quantity: qty } : l))
    );
  };

  const setNote = (variantId: string, note: string) =>
    setLines((prev) => prev.map((l) => (l.variantId === variantId ? { ...l, note } : l)));

  const remove = (variantId: string) => setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  const clear = () => setLines([]);

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const totalWeightKg = lines.reduce((sum, l) => sum + (l.weightKg ?? 0) * l.quantity, 0);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  return (
    <CartContext.Provider value={{ lines, add, updateQty, setNote, remove, clear, subtotal, totalWeightKg, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
