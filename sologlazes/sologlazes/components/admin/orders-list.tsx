"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Trash2, RotateCcw } from "lucide-react";
import { deleteOrdersAction, purgeOrdersAction, restoreOrdersAction } from "@/lib/actions/admin-orders";

export type OrderRowItem = { id: string; label: string; node: ReactNode };

export function OrdersList({ rows, trash = false }: { rows: OrderRowItem[]; trash?: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const ids = rows.map((r) => r.id);
  const visibleSelected = ids.filter((id) => selected.has(id));
  const count = visibleSelected.length;
  const allOn = count > 0 && count === ids.length;

  function toggle(id: string) {
    setConfirming(false);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setConfirming(false);
    setSelected(allOn ? new Set() : new Set(ids));
  }

  function remove() {
    setError("");
    startTransition(async () => {
      try {
        if (trash) await purgeOrdersAction(visibleSelected);
        else await deleteOrdersAction(visibleSelected);
        setSelected(new Set());
        setConfirming(false);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo eliminar.");
      }
    });
  }

  function restore() {
    setError("");
    startTransition(async () => {
      try {
        await restoreOrdersAction(visibleSelected);
        setSelected(new Set());
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo restaurar.");
      }
    });
  }

  return (
    <div>
      {/* Barra de selección */}
      <div className="mb-3 flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-border bg-surface px-4 py-2">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <input type="checkbox" checked={allOn} onChange={toggleAll} className="h-5 w-5 cursor-pointer accent-[#DC2626]" />
          Seleccionar todos
        </label>
        <span className="text-sm text-text-secondary">{count > 0 ? `${count} seleccionado${count > 1 ? "s" : ""}` : `${ids.length} pedidos`}</span>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {confirming ? (
            <>
              <span className="text-sm font-medium text-[#DC2626]">
                {trash ? `¿Eliminar ${count} pedido${count > 1 ? "s" : ""} para siempre?` : `¿Mover ${count} pedido${count > 1 ? "s" : ""} a la papelera?`}
              </span>
              <button type="button" onClick={remove} disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-[#DC2626] px-4 py-2 text-sm text-white disabled:opacity-60">
                <Trash2 size={15} /> {pending ? "…" : trash ? "Sí, eliminar para siempre" : "Sí, a la papelera"}
              </button>
              <button type="button" onClick={() => setConfirming(false)} disabled={pending} className="rounded-full border border-border-strong px-4 py-2 text-sm">
                Cancelar
              </button>
            </>
          ) : (
            <>
            {trash && (
              <button
                type="button"
                onClick={restore}
                disabled={count === 0 || pending}
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-sm transition-colors enabled:hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={15} /> Restaurar{count > 0 ? ` (${count})` : ""}
              </button>
            )}
            <button
              type="button"
              onClick={() => setConfirming(true)}
              disabled={count === 0}
              className="inline-flex items-center gap-2 rounded-full border border-[#DC2626] px-4 py-2 text-sm text-[#DC2626] transition-colors enabled:hover:bg-[#DC2626] enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={15} /> {trash ? "Eliminar para siempre" : "Eliminar"}{count > 0 ? ` (${count})` : ""}
            </button>
            </>
          )}
        </div>
        {confirming && (
          <p className="basis-full text-xs text-text-secondary">
            {trash
              ? "Se borran definitivamente, no se pueden recuperar."
              : "Van a la papelera (se pueden restaurar). Las unidades vuelven al stock, como al cancelar."}
          </p>
        )}
        {error && <p className="basis-full text-sm text-[#DC2626]">{error}</p>}
      </div>

      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.id} className="flex items-stretch gap-3">
            <label className="flex w-8 shrink-0 cursor-pointer items-center justify-center" title={`Seleccionar ${r.label}`}>
              <input
                type="checkbox"
                checked={selected.has(r.id)}
                onChange={() => toggle(r.id)}
                aria-label={`Seleccionar pedido ${r.label}`}
                className="h-5 w-5 cursor-pointer accent-[#DC2626]"
              />
            </label>
            <div className="min-w-0 flex-1">{r.node}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
