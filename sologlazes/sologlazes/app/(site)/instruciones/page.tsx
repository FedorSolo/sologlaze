import { redirect } from "next/navigation";

// Enlace corto (QR del empaque): lleva al inicio de la guía (video),
// conservando los parámetros utm para la analítica.
export const metadata = { robots: { index: false, follow: true } };

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (!k.startsWith("utm_")) continue;
    const val = Array.isArray(v) ? v[0] : v;
    if (val) qs.set(k, val.slice(0, 80));
  }
  const q = qs.toString();
  redirect(`/guia${q ? `?${q}` : ""}`);
}
