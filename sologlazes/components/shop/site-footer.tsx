import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

const columns = [
  {
    title: "Producto",
    links: [
      { href: "/catalogo", label: "Catálogo" },
      { href: "/catalogo/cristalina", label: "Cristalina" },
      { href: "/catalogo/floating", label: "Floating" },
      { href: "/catalogo/grrr", label: "GRRR" },
    ],
  },
  {
    title: "Ayuda",
    links: [
      { href: "/envios-y-devoluciones", label: "Envíos y devoluciones" },
      { href: "/guia/como-aplicar", label: "Guía de aplicación" },
      { href: "/contacto", label: "Contacto (WhatsApp)" },
    ],
  },
  {
    title: "Marca",
    links: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/galeria", label: "Galería" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terminos", label: "Términos" },
      { href: "/privacidad", label: "Privacidad" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface-muted">
      <div className="container grid grid-cols-2 gap-8 py-16 lg:grid-cols-4">
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-caption uppercase tracking-wide text-text-secondary">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container flex flex-col items-center justify-between gap-4 border-t border-border py-6 text-sm text-text-secondary sm:flex-row">
        <span>© {new Date().getFullYear()} SoloGlazes — Salta / CABA, Argentina</span>
        <div className="flex gap-4">
          <a href="https://instagram.com" aria-label="Instagram" className="hover:text-accent"><Instagram size={18} /></a>
          <a href="https://wa.me/5491127379589" aria-label="WhatsApp" className="hover:text-accent"><MessageCircle size={18} /></a>
        </div>
      </div>
    </footer>
  );
}
