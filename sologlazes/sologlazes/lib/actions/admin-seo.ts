"use server";

import { assertAdmin } from "@/lib/admin-guard";
import { gscConfig, inspectUrl, type UrlInspection } from "@/lib/gsc";
import sitemap from "@/app/sitemap";

export type IndexRow = { url: string; verdict: string; state: string; lastCrawl: string | null; error?: string };

// Pregunta a Google, URL por URL, si cada página del sitemap está indexada.
// Cuesta una consulta de la cuota diaria de Google (2.000) por página, por eso es un botón y no automático.
export async function checkIndexingAction(): Promise<{ rows: IndexRow[]; error?: string }> {
  await assertAdmin();
  if (!gscConfig()) return { rows: [], error: "Search Console no está configurado." };

  const urls = Array.from(new Set((await sitemap()).map((e) => e.url))).slice(0, 150);
  const rows: IndexRow[] = new Array(urls.length);
  let next = 0;

  async function worker() {
    while (next < urls.length) {
      const i = next++;
      try {
        const r: UrlInspection = await inspectUrl(urls[i]);
        rows[i] = { url: urls[i], verdict: r.verdict, state: r.coverageState, lastCrawl: r.lastCrawlTime ?? null };
      } catch (e) {
        rows[i] = { url: urls[i], verdict: "ERROR", state: "No se pudo consultar", lastCrawl: null, error: e instanceof Error ? e.message : String(e) };
      }
    }
  }
  await Promise.all(Array.from({ length: 6 }, worker));
  return { rows };
}
