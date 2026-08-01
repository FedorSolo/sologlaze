"use client";

import { useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { ProductCard, type ProductCardData } from "@/components/shop/product-card";

type FilterState = Record<string, string[]>;
type CatalogProduct = ProductCardData & { temperature: string };

const attrKeyMap: Record<string, "temperature" | "collection"> = {
  temperature: "temperature",
  collection: "collection",
};

type FilterGroup = { key: string; label: string; options: string[] };

export function CatalogBrowser({
  products,
  filterGroups,
}: {
  products: CatalogProduct[];
  filterGroups: FilterGroup[];
}) {
  const [active, setActive] = useState<FilterState>({});
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc">("popular");

  const toggle = (groupKey: string, value: string) => {
    setActive((s) => {
      const current = s[groupKey] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...s, [groupKey]: next };
    });
  };

  const clear = () => setActive({});

  const filtered = useMemo(() => {
    let items = products;

    for (const [groupKey, values] of Object.entries(active)) {
      if (!values.length) continue;
      const field = attrKeyMap[groupKey];
      items = items.filter((p) => {
        if (field === "collection") return values.includes(p.collection.name);
        return values.includes(p[field]);
      });
    }

    if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);

    return items;
  }, [active, sort, products]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <CatalogFilters groups={filterGroups} active={active} onToggle={toggle} onClear={clear} resultCount={filtered.length} />

      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-text-secondary">{filtered.length} productos</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-border-strong bg-surface px-4 py-2 text-sm"
            aria-label="Ordenar por"
          >
            <option value="popular">Más populares</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-24 text-center">
            <PackageSearch size={32} className="text-text-secondary" />
            <p className="text-h3">Sin resultados con estos filtros</p>
            <p className="max-w-xs text-sm text-text-secondary">
              Probá con otra combinación de temperatura, superficie o efecto.
            </p>
            <button onClick={clear} className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm text-white">
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
