"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";

const SLOTS = 5;

export function PackPruebaPicker({ variantId, initialNote }: { variantId: string; initialNote?: string }) {
  const { setNote } = useCart();
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [choices, setChoices] = useState<string[]>(
    initialNote ? initialNote.split("|").slice(0, SLOTS).concat(Array(SLOTS).fill("")).slice(0, SLOTS) : Array(SLOTS).fill("")
  );

  useEffect(() => {
    fetch("/api/pack-prueba-opciones")
      .then((r) => r.json())
      .then(setOptions)
      .catch(() => setOptions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (i: number, value: string) => {
    const next = [...choices];
    next[i] = value;
    setChoices(next);
    setNote(variantId, next.filter(Boolean).join("|"));
  };

  const chosenCount = choices.filter(Boolean).length;

  return (
    <div className="mt-3 rounded-md border border-border bg-surface-muted p-3">
      <p className="mb-2 text-xs font-medium">
        Elegí tus 5 esmaltes ({chosenCount}/{SLOTS})
      </p>
      {loading ? (
        <p className="text-xs text-text-secondary">Cargando opciones…</p>
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {Array.from({ length: SLOTS }).map((_, i) => (
            <select
              key={i}
              value={choices[i] ?? ""}
              onChange={(e) => handleChange(i, e.target.value)}
              className="h-9 w-full min-w-0 rounded-sm border border-border bg-bg px-2 text-xs"
            >
              <option value="">Esmalte {i + 1}…</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
      {chosenCount < SLOTS && (
        <p className="mt-2 text-xs text-status-warning">
          Faltan {SLOTS - chosenCount} esmaltes por elegir — si no los completás, te contactamos por WhatsApp para coordinarlo.
        </p>
      )}
    </div>
  );
}
