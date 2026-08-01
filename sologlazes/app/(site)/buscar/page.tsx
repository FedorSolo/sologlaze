"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { ProductCard, type ProductCardData } from "@/components/shop/product-card";

export default function BuscarPage() {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setResults(data.results))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250); // debounce

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="container py-10 lg:py-14">
      <h1 className="mb-6 text-h1 lg:text-h1-lg">Buscar</h1>

      <div className="relative mb-8 max-w-md">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, color o serie..."
          className="h-12 w-full rounded-full border border-border-strong pl-11 pr-4 text-sm focus:border-accent"
        />
      </div>

      {query.trim() === "" ? (
        <p className="text-sm text-text-secondary">Escribí para buscar en el catálogo.</p>
      ) : loading ? (
        <p className="text-sm text-text-secondary">Buscando...</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-text-secondary">Sin resultados para &quot;{query}&quot;.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
