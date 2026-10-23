"use client";

import { useState, useTransition } from "react";
import { checkIndexingAction, type IndexRow } from "@/lib/actions/admin-seo";

const GROUPS: { key: string; label: string; color: string; test: (r: IndexRow) => boolean }[] = [
  { key: "ok", label: "Indexadas", color: "#16A34A", test: (r) => r.verdict === "PASS" },
  { key: "wait", label: "Pendientes (Google la conoce, aún no la indexa)", color: "#D97706", test: (r) => r.verdict !== "PASS" && r.verdict !== "ERROR" && /discovered|crawled|unknown|no conoce|not indexed|currently/i.test(r.state) },
  { key: "bad", label: "Con problemas / excluidas", color: "#DC2626", test: (r) => r.verdict === "FAIL" || r.verdict === "PARTIAL" },
  { key: "err", label: "No se pudo consultar", color: "#6B7280", test: (r) => r.verdict === "ERROR" },
];

export function IndexChecker() {
  const [rows, setRows] = useState<IndexRow[] | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function run() {
    setError("");
    start(async () => {
      try {
        const res = await checkIndexingAction();
        if (res.error) setError(res.error);
        else setRows(res.rows);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Falló la consulta.");
      }
    });
  }

  const classify = (r: IndexRow) => GROUPS.find((g) => g.test(r))?.key ?? "wait";
  const ok = rows?.filter((r) => classify(r) === "ok").length ?? 0;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button type="button" onClick={run} disabled={pending} className="rounded-full bg-accent px-5 py-2.5 text-sm text-white transition-colors hover:bg-accent-hover disabled:opacity-60">
          {pending ? "Consultando a Google… (puede tardar ~30 s)" : rows ? "Volver a comprobar" : "Comprobar indexación de todas las páginas"}
        </button>
        {rows && (
          <span className="text-sm text-text-secondary">
            {ok} de {rows.length} páginas indexadas ({Math.round((ok / Math.max(1, rows.length)) * 100)} %)
          </span>
        )}
      </div>
      {error && <p className="mb-3 text-sm text-[#DC2626]">{error}</p>}

      {rows && (
        <>
          <div className="mb-4 h-3 w-full overflow-hidden rounded-[999px] bg-surface-muted">
            <div className="h-full" style={{ width: `${(ok / Math.max(1, rows.length)) * 100}%`, background: "#16A34A" }} />
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {GROUPS.map((g) => {
              const c = rows.filter((r) => classify(r) === g.key).length;
              return c ? (
                <span key={g.key} className="inline-flex items-center gap-2 rounded-[999px] border px-3 py-1 text-xs" style={{ borderColor: `${g.color}55`, color: g.color }}>
                  <span className="h-2 w-2 rounded-[50%]" style={{ background: g.color }} /> {g.label}: {c}
                </span>
              ) : null;
            })}
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wide text-text-secondary">
                <tr>
                  <th className="px-3 py-2">Página</th>
                  <th className="px-3 py-2">Estado en Google</th>
                  <th className="px-3 py-2">Último rastreo</th>
                </tr>
              </thead>
              <tbody>
                {[...rows]
                  .sort((a, b) => GROUPS.findIndex((g) => g.key === classify(b)) - GROUPS.findIndex((g) => g.key === classify(a)))
                  .map((r) => {
                    const g = GROUPS.find((x) => x.key === classify(r))!;
                    return (
                      <tr key={r.url} className="border-t border-border">
                        <td className="max-w-[360px] break-all px-3 py-2">{r.url.replace("https://sologlazes.com.ar", "") || "/"}</td>
                        <td className="px-3 py-2">
                          <span className="inline-flex items-center gap-2" style={{ color: g.color }}>
                            <span className="h-2 w-2 rounded-[50%]" style={{ background: g.color }} /> {r.state}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-text-secondary">{r.lastCrawl ? new Date(r.lastCrawl).toLocaleDateString("es-AR") : "—"}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
