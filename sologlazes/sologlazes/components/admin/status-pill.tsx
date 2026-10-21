import { ORDER_STATUS } from "@/lib/admin-order-status";

export function StatusPill({ status, large }: { status: string; large?: boolean }) {
  const s = ORDER_STATUS[status] ?? ORDER_STATUS.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-[999px] font-medium ${large ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs"}`}
      style={{ color: s.color, background: s.tint, border: `1px solid ${s.color}33` }}
    >
      <span className="inline-block h-2 w-2 rounded-[50%]" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}
