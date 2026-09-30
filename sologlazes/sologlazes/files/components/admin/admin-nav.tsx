"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Star, Upload, BarChart3, LogOut } from "lucide-react";

const items = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/resenas", label: "Reseñas", icon: Star },
  { href: "/admin/media", label: "Subir imagen", icon: Upload },
  { href: "/admin/estadisticas", label: "Estadísticas", icon: BarChart3 },
];

export function AdminNav() {
  const pathname = usePathname();

  const linkBase = "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2.5 text-sm transition-colors";

  return (
    <nav className="border-b border-border p-2 lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r lg:p-4">
      <div className="flex gap-1 overflow-x-auto lg:sticky lg:top-4 lg:min-h-[calc(100vh-2rem)] lg:flex-col lg:overflow-visible">
        <Link href="/" className={`${linkBase} text-text-secondary hover:bg-surface-muted lg:mb-3 lg:px-2`}>← Volver al sitio</Link>
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${linkBase} ${active ? "bg-accent-soft text-accent" : "text-text-secondary hover:bg-surface-muted"}`}
            >
              <Icon size={16} /> {label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`${linkBase} text-text-secondary hover:bg-surface-muted lg:mt-auto`}
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
