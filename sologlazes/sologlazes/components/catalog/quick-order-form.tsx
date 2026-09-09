"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { createQuickOrderAction } from "@/lib/actions/quick-order";

export function QuickOrderForm() {
  const { lines, clear } = useCart();
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Ingresá tu número de WhatsApp.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { whatsappUrl } = await createQuickOrderAction({
        phone,
        lines: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
      });
      clear();
      window.location.href = whatsappUrl;
    } catch {
      setError("No pudimos crear el pedido. Probá de nuevo.");
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-border-strong py-3 text-sm font-medium transition-colors hover:bg-surface-muted"
      >
        <MessageCircle size={16} /> Pedido rápido por WhatsApp
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-surface-muted p-4">
      <p className="mb-3 text-sm text-text-secondary">
        Dejanos tu WhatsApp y te contactamos para coordinar pago y envío — sin llenar el formulario completo.
      </p>
      <div className="flex gap-2">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+54 9 11 ..."
          className="h-11 flex-1 rounded-sm border border-border px-3 text-sm"
          autoFocus
        />
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          <MessageCircle size={16} /> {submitting ? "..." : "Enviar"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-status-error">{error}</p>}
    </form>
  );
}
