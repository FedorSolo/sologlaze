const labels: Record<string, { text: string; className: string }> = {
  PENDING: { text: "Pendiente", className: "bg-status-info/10 text-status-info" },
  PAID: { text: "Pagado", className: "bg-status-info/10 text-status-info" },
  PROCESSING: { text: "En preparación", className: "bg-status-warning/10 text-status-warning" },
  SHIPPED: { text: "Enviado", className: "bg-status-info/10 text-status-info" },
  DELIVERED: { text: "Entregado", className: "bg-status-success/10 text-status-success" },
  CANCELLED: { text: "Cancelado", className: "bg-status-error/10 text-status-error" },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const cfg = labels[status] ?? labels.PENDING;
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${cfg.className}`}>{cfg.text}</span>;
}
