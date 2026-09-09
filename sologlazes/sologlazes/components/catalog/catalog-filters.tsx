"use client";

import { useState } from "react";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";

type FilterGroup = { key: string; label: string; options: string[] };

export function CatalogFilters({
  groups,
  active,
  onToggle,
  onClear,
  resultCount,
}: {
  groups: FilterGroup[];
  active: Record<string, string[]>;
  onToggle: (groupKey: string, value: string) => void;
  onClear: () => void;
  resultCount: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.key, true]))
  );

  const activeCount = Object.values(active).flat().length;

  const body = (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.key} className="border-b border-border pb-4 last:border-0">
          <button
            className="flex w-full items-center justify-between py-1 text-left text-sm font-medium"
            onClick={() => setOpenGroups((s) => ({ ...s, [group.key]: !s[group.key] }))}
          >
            {group.label}
            <ChevronDown
              size={16}
              className={`transition-transform ${openGroups[group.key] ? "rotate-180" : ""}`}
            />
          </button>
          {openGroups[group.key] && (
            <div className="mt-2 flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const isActive = active[group.key]?.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => onToggle(group.key, opt)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "border-accent bg-accent-soft text-accent"
                        : "border-border text-text-secondary hover:border-border-strong"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-24">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-h3">Filtrar</h2>
            {activeCount > 0 && (
              <button onClick={onClear} className="text-sm text-accent hover:underline">
                Limpiar ({activeCount})
              </button>
            )}
          </div>
          {body}
        </div>
      </aside>

      {/* Mobile trigger */}
      <button
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-border-strong px-4 py-2 text-sm lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <SlidersHorizontal size={16} />
        Filtrar {activeCount > 0 && `(${activeCount})`}
      </button>

      {/* Mobile bottom-sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div className="absolute inset-0 bg-text-primary/40" onClick={() => setMobileOpen(false)} />
          <div className="relative max-h-[85vh] overflow-y-auto rounded-t-lg bg-surface p-6 pb-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-h3">Filtrar</h2>
              <button aria-label="Cerrar" onClick={() => setMobileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            {body}
            <div className="sticky bottom-0 -mx-6 mt-6 flex gap-3 border-t border-border bg-surface p-4">
              {activeCount > 0 && (
                <button onClick={onClear} className="flex-1 rounded-full border border-border-strong py-3 text-sm">
                  Limpiar
                </button>
              )}
              <button
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-full bg-accent py-3 text-sm text-white"
              >
                Ver {resultCount} resultados
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
