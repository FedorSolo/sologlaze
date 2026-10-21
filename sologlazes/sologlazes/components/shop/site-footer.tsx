"use client";

import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { COLLECTION_NAMES } from "@/lib/i18n-dict";

export function SiteFooter() {
  const { t, lang, href } = useLang();
  const columns = [
    {
      title: t("footProducto"),
      links: [
        { href: "/catalogo", label: t("catalogo") },
        ...["cristalina", "floating", "grrr", "pack-prueba"].map((slug) => ({ href: `/catalogo/${slug}`, label: COLLECTION_NAMES[slug][lang] })),
      ],
    },
    {
      title: t("footAyuda"),
      links: [
        { href: "/envios-y-devoluciones", label: t("envios") },
        { href: "/guia/como-aplicar", label: t("guiaAplicacion") },
        { href: "/contacto", label: t("contactoWa") },
      ],
    },
    {
      title: t("footMarca"),
      links: [
        { href: "/nosotros", label: t("nosotros") },
        { href: "/coworking", label: t("coworking") },
      ],
    },
    {
      title: t("footLegal"),
      links: [
        { href: "/terminos", label: t("terminos") },
        { href: "/privacidad", label: t("privacidad") },
      ],
    },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-surface-muted">
      <div className="container grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:gap-x-8 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-caption uppercase tracking-wide text-text-secondary">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={href(l.href)} className="hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-sm text-text-secondary sm:flex-row">
        <span className="text-center sm:text-left">© {new Date().getFullYear()} SoloGlazes — Federico Lacroze 1658, Buenos Aires, Argentina</span>
        <div className="flex gap-4">
          <a href="https://instagram.com/sologlazes.arg" target="_blank" rel="noreferrer" aria-label="Instagram @sologlazes.arg" className="p-1 hover:text-accent"><Instagram size={20} /></a>
          <a href="https://wa.me/5491127379589" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="p-1 hover:text-accent"><MessageCircle size={20} /></a>
        </div>
      </div>
    </footer>
  );
}
