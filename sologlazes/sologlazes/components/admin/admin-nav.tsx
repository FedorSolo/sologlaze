"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Star, Image as ImageIcon, BarChart3 } from "lucide-react";

const items = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/resenas", label: "Reseñas", icon: Star },
  { href: "/admin/galeria", label: "Galería", icon: ImageIcon },
  { href: "/admin/estadisticas", label: "Estadísticas", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-border p-4">
      <Link href="/" className="mb-4 px-2 text-sm text-text-secondary">← Volver al sitio</Link>
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors ${
              active ? "bg-accent-soft text-accent" : "text-text-secondary hover:bg-surface-muted"
            }`}
          >
            <Icon size={16} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}
