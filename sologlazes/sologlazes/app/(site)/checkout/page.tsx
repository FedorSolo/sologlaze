"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Truck, Wallet, Banknote, Landmark } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { createOrderAction } from "@/lib/actions/checkout";

const FREE_CABA_THRESHOLD_KG = 3;

function getShippingOptions(totalWeightKg: number) {
  const cabaFree = totalWeightKg >= FREE_CABA_THRESHOLD_KG;
  return [
    {
      id: "caba_moto",
      label: "CABA — moto/Uber",
      detail: cabaFree ? `Gratis a partir de ${FREE_CABA_THRESHOLD_KG}kg` : "Costo a coordinar según distancia",
      price: 0,
      note: cabaFree ? undefined : "Envío CABA a coordinar según distancia — no incluido en este total.",
    },
    {
      id: "correo_andreani",
      label: "Resto del país",
      detail: "Correo Argentino o Andreani — a coordinar y pagar aparte",
      price: 0,
      note: "Envío al interior a coordinar y pagar aparte — no incluido en este total.",
    },
  ];
}

const paymentOptions = [
  { id: "MERCADO_PAGO" as const, label: "Mercado Pago", detail: "Tarjeta, débito o dinero en cuenta", icon: Wallet },
  { id: "MANUAL" as const, label: "Transferencia bancaria", detail: "Te pasamos el CBU al confirmar", icon: Landmark },
  { id: "EFECTIVO" as const, label: "Efectivo", detail: "Retiro en el taller o contra entrega en CABA", icon: Banknote },
];

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
      const { orderNumber, mpCheckoutUrl } = await createOrderAction({
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
        shippingLabel: `${shippingOption.label} — ${shippingOption.detail}`,
        shippingCost: shippingOption.price,
        paymentProvider: payment === "MERCADO_PAGO" ? "MERCADO_PAGO" : "MANUAL",
        lines: lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
      });
      clear();
      if (mpCheckoutUrl) {
        window.location.href = mpCheckoutUrl;
      } else {
        router.push(`/checkout/confirmacion/${orderNumber}`);
      }
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
        <div className="space-y-8">
          <Step number={1} title="Tus datos">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nombre y apellido" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Teléfono (WhatsApp)" name="phone" required />
              <Field label="Ciudad" name="city" required />
              <Field label="Calle y número" name="street" className="sm:col-span-2" required />
              <Field label="Código postal" name="postalCode" required />
              <Field label="Provincia" name="province" required />
            </div>
          </Step>

          <Step number={2} title="Cómo lo recibís">
            <p className="mb-3 flex items-center gap-1.5 text-xs text-text-secondary">
              <Truck size={14} /> Peso total del pedido: {totalWeightKg.toFixed(2)} kg
            </p>
            <div className="space-y-2">
              {shippingOptions.map((opt) => (
                <OptionRow
                  key={opt.id}
                  selected={shipping === opt.id}
                  onSelect={() => setShipping(opt.id)}
                  title={opt.label}
                  detail={opt.detail}
                  right={opt.note ? "A coordinar" : "Gratis"}
                  inputName="shippingOption"
                />
              ))}
            </div>
          </Step>

          <Step number={3} title="Cómo pagás">
            <div className="space-y-2">
              {paymentOptions.map((opt) => (
                <OptionRow
                  key={opt.id}
                  selected={payment === opt.id}
                  onSelect={() => setPayment(opt.id)}
                  title={opt.label}
                  detail={opt.detail}
                  icon={opt.icon}
                  inputName="paymentOption"
                />
              ))}
            </div>
          </Step>

          <Step number={4} title="Comentario" optional>
            <textarea
              name="comment"
              rows={3}
              placeholder="Opcional — por ejemplo, si es para un taller"
              className="w-full rounded-sm border border-border p-3 text-sm focus:border-accent"
            />
          </Step>
        </div>

        <aside className="h-fit space-y-4 rounded-lg border border-border bg-surface p-6 lg:sticky lg:top-6">
          <h2 className="text-h3">Resumen</h2>
          <div className="space-y-2">
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
              <span>{shippingOption.note ? "A coordinar" : "Gratis"}</span>
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
          {error && <p className="text-sm text-status-error">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? "Procesando..." : "Confirmar pedido"}
          </button>
        </aside>
      </div>
    </form>
  );
}

function Step({
  number,
  title,
  optional,
  children,
}: {
  number: number;
  title: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2.5 text-h3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-text-primary text-xs font-medium text-bg">
          {number}
        </span>
        {title}
        {optional && <span className="text-xs font-normal text-text-secondary">(opcional)</span>}
      </h2>
      {children}
    </section>
  );
}

function OptionRow({
  selected,
  onSelect,
  title,
  detail,
  right,
  icon: Icon,
  inputName,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  detail: string;
  right?: string;
  icon?: React.ComponentType<{ size?: number }>;
  inputName: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center justify-between gap-3 rounded-md border px-4 py-3 text-sm transition-colors ${
        selected ? "border-accent bg-accent-soft" : "border-border hover:border-accent"
      }`}
    >
      <span className="flex items-center gap-3">
        <input type="radio" name={inputName} checked={selected} onChange={onSelect} />
        {Icon && <Icon size={16} />}
        <span>
          <span className="block">{title}</span>
          <span className="block text-xs text-text-secondary">{detail}</span>
        </span>
      </span>
      {right && <span className="shrink-0 whitespace-nowrap text-xs font-medium text-text-secondary">{right}</span>}
    </label>
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
