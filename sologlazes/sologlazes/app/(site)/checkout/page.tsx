"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { createOrderAction } from "@/lib/actions/checkout";

const FREE_CABA_THRESHOLD_KG = 3;

function getShippingOptions(totalWeightKg: number) {
  const cabaFree = totalWeightKg >= FREE_CABA_THRESHOLD_KG;
  return [
    {
      id: "caba_moto",
      label: cabaFree ? "CABA — moto/Uber (envío gratis, pedido +3kg)" : "CABA — moto/Uber (a coordinar según distancia)",
      price: cabaFree ? 0 : 0, // el costo real por distancia se coordina aparte cuando no es gratis
      note: cabaFree ? undefined : "Envío CABA a coordinar según distancia — no incluido en este total.",
    },
    {
      id: "correo_andreani",
      label: "Resto del país — Correo Argentino / Andreani (a coordinar y pagar aparte)",
      price: 0,
      note: "Envío al interior a coordinar y pagar aparte — no incluido en este total.",
    },
  ];
}

export default function CheckoutPage() {
  const { lines, subtotal, totalWeightKg, clear } = useCart();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const shippingOptions = getShippingOptions(totalWeightKg);
  const [shipping, setShipping] = useState(shippingOptions[0].id);
  const [payment, setPayment] = useState<"MERCADO_PAGO" | "MANUAL" | "EFECTIVO">("MERCADO_PAGO");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingOption = shippingOptions.find((s) => s.id === shipping)!;
  const total = subtotal + shippingOption.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(formRef.current!);
    try {
      const { orderNumber } = await createOrderAction({
        name: String(formData.get("name")),
        email: String(formData.get("email")),
        phone: String(formData.get("phone")),
        city: String(formData.get("city")),
        street: String(formData.get("street")),
        postalCode: String(formData.get("postalCode")),
        province: String(formData.get("province")),
        comment: [
          payment === "EFECTIVO" ? "Pago: Efectivo (retiro en el taller o contra entrega en CABA)." : "",
          shippingOption.note ?? "",
          String(formData.get("comment") ?? ""),
        ].filter(Boolean).join(" ") || undefined,
        shippingLabel: shippingOption.label,
        shippingCost: shippingOption.price,
        paymentProvider: payment === "MERCADO_PAGO" ? "MERCADO_PAGO" : "MANUAL",
        lines: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
      });
      clear();
      router.push(`/checkout/confirmacion/${orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos procesar el pedido. Intentá de nuevo.");
      setSubmitting(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="container py-24 text-center">
        <p className="text-h3">No hay productos en el carrito.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="container py-10 lg:py-14">
      <h1 className="mb-8 text-h1 lg:text-h1-lg">Finalizar compra</h1>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 text-h3">Datos de contacto y envío</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre y apellido" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Teléfono (WhatsApp)" name="phone" required />
              <Field label="Ciudad" name="city" required />
              <Field label="Calle y número" name="street" className="sm:col-span-2" required />
              <Field label="Código postal" name="postalCode" required />
              <Field label="Provincia" name="province" required />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-h3">Comentario del pedido</h2>
            <textarea
              name="comment"
              rows={3}
              placeholder="Opcional — por ejemplo, si es para un taller"
              className="w-full rounded-sm border border-border p-3 text-sm"
            />
          </section>

          <section>
            <h2 className="mb-1 text-h3">Método de envío</h2>
            <p className="mb-4 text-xs text-text-secondary">
              Peso total del pedido: {totalWeightKg.toFixed(2)} kg
              {totalWeightKg < FREE_CABA_THRESHOLD_KG &&
                ` (envío CABA gratis desde ${FREE_CABA_THRESHOLD_KG}kg)`}
            </p>
            <div className="space-y-2">
              {shippingOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center justify-between rounded-md border px-4 py-3 text-sm ${
                    shipping === opt.id ? "border-accent bg-accent-soft" : "border-border"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingOption"
                      checked={shipping === opt.id}
                      onChange={() => setShipping(opt.id)}
                    />
                    {opt.label}
                  </span>
                  <span className="font-medium">
                    {opt.note ? "A coordinar" : opt.price === 0 ? "Gratis" : `$ ${opt.price.toLocaleString("es-AR")}`}
                  </span>
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-h3">Pago</h2>
            <div className="space-y-2">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm ${
                  payment === "MERCADO_PAGO" ? "border-accent bg-accent-soft" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="paymentOption"
                  checked={payment === "MERCADO_PAGO"}
                  onChange={() => setPayment("MERCADO_PAGO")}
                />
                Mercado Pago
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm ${
                  payment === "MANUAL" ? "border-accent bg-accent-soft" : "border-border"
                }`}
              >
                <input type="radio" name="paymentOption" checked={payment === "MANUAL"} onChange={() => setPayment("MANUAL")} />
                Transferencia bancaria
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm ${
                  payment === "EFECTIVO" ? "border-accent bg-accent-soft" : "border-border"
                }`}
              >
                <input type="radio" name="paymentOption" checked={payment === "EFECTIVO"} onChange={() => setPayment("EFECTIVO")} />
                Efectivo (retiro en el taller o contra entrega en CABA)
              </label>
            </div>
            <p className="mt-2 text-xs text-text-secondary">
              La integración con claves reales de Mercado Pago se conecta en el deploy (ver PRD, fuera de alcance v1).
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-4 text-h3">Resumen</h2>
          <div className="mb-4 space-y-2">
            {lines.map((l) => (
              <div key={l.slug} className="flex justify-between text-sm">
                <span className="text-text-secondary">
                  {l.name} × {l.quantity}
                </span>
                <span>$ {(l.price * l.quantity).toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Subtotal</span>
              <span>$ {subtotal.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Envío</span>
              <span>
                {shippingOption.note ? "A coordinar" : shippingOption.price === 0 ? "Gratis" : `$ ${shippingOption.price.toLocaleString("es-AR")}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-medium">
              <span>Total</span>
              <span>$ {total.toLocaleString("es-AR")} ARS</span>
            </div>
            {shippingOption.note && (
              <p className="text-xs text-text-secondary">
                El costo de envío se coordina por WhatsApp después de confirmar el pedido — no está incluido en este total.
              </p>
            )}
          </div>
          {error && <p className="mt-3 text-sm text-status-error">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? "Procesando..." : "Confirmar pedido"}
          </button>
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1 block text-text-secondary">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="h-11 w-full rounded-sm border border-border px-3 focus:border-accent"
      />
    </label>
  );
}
