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
      { href: "/catalogo/pack-prueba", label: "Pack Prueba" },
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
      { href: "/coworking", label: "Coworking" },
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
      <div className="container grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:gap-x-8 lg:grid-cols-4">
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
        <span className="text-center sm:text-left">© {new Date().getFullYear()} SoloGlazes — Federico Lacroze 1658, Buenos Aires, Argentina</span>
        <div className="flex gap-4">
          <a href="https://instagram.com/sologlazes.arg" target="_blank" rel="noreferrer" aria-label="Instagram @sologlazes.arg" className="p-1 hover:text-accent"><Instagram size={20} /></a>
          <a href="https://wa.me/5491127379589" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="p-1 hover:text-accent"><MessageCircle size={20} /></a>
        </div>
      </div>
    </footer>
  );
}
