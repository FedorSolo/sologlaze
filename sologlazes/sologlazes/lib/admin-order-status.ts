// Colores y nombres de los estados de pedido para el panel (se usan con style inline: no dependen de Tailwind).
export const ORDER_STATUS: Record<string, { label: string; color: string; tint: string; hint: string }> = {
  PENDING: { label: "Nuevo", color: "#2563EB", tint: "#EFF5FF", hint: "Recién llegó, falta gestionarlo" },
  PAID: { label: "Pagado", color: "#0891B2", tint: "#ECFAFD", hint: "Pago acreditado, falta preparar" },
  PROCESSING: { label: "En preparación", color: "#D97706", tint: "#FFF7E8", hint: "Lo estás armando" },
  SHIPPED: { label: "Enviado", color: "#7C3AED", tint: "#F5F0FF", hint: "En camino al cliente" },
  DELIVERED: { label: "Entregado", color: "#16A34A", tint: "#EEFAF1", hint: "Listo, entregado" },
  CANCELLED: { label: "Cancelado", color: "#DC2626", tint: "#FEF0F0", hint: "Cancelado (el stock se devuelve)" },
  REFUNDED: { label: "Reembolsado", color: "#6B7280", tint: "#F3F4F6", hint: "Pago devuelto" },
};

export const ORDER_STATUS_ORDER = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  FAILED: "Falló",
  REFUNDED: "Reembolsado",
};

export const PAYMENT_PROVIDER_LABEL: Record<string, string> = {
  MERCADO_PAGO: "Mercado Pago",
  MANUAL: "Manual / a coordinar",
  STRIPE: "Stripe",
};
