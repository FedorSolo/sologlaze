"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, User, MapPin, Heart } from "lucide-react";

const items = [
  { href: "/cuenta/pedidos", label: "Pedidos", icon: Package },
  { href: "/cuenta/perfil", label: "Perfil", icon: User },
  { href: "/cuenta/direcciones", label: "Direcciones", icon: MapPin },
  { href: "/cuenta/favoritos", label: "Favoritos", icon: Heart },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border pb-1 lg:w-56 lg:flex-col lg:border-b-0 lg:pb-0">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors ${
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
