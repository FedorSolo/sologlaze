"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, User, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useCart } from "@/lib/cart-context";

const collections = [
  { slug: "cristalina", name: "Cristalina" },
  { slug: "floating", name: "Floating" },
  { slug: "grrr", name: "GRRR" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-bg/80 backdrop-blur transition-colors">
      <div className="container flex h-16 items-center justify-between lg:h-20">
        <button
          className="lg:hidden p-2 -ml-2 text-text-primary"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>

        <Link href="/" className="flex items-center gap-1.5" aria-label="SoloGlazes — inicio">
          <Image
            src="/images/logo-solo.png"
            alt="Solo"
            width={92}
            height={58}
            className="h-9 w-auto lg:h-11"
            priority
          />
          <span className="font-sans text-sm font-medium text-text-secondary lg:text-base">Glazes</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm">
          <div className="group relative">
            <button className="hover:text-accent transition-colors">Catálogo</button>
            <div className="absolute left-0 top-full hidden pt-4 group-hover:block">
              <div className="flex gap-2 rounded-lg bg-surface p-3 shadow-lg">
                {collections.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/catalogo/${c.slug}`}
                    className="rounded-md px-4 py-2 text-sm hover:bg-surface-muted whitespace-nowrap"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/guia" className="hover:text-accent transition-colors">Guía</Link>
          <Link href="/galeria" className="hover:text-accent transition-colors">Galería</Link>
          <Link href="/nosotros" className="hover:text-accent transition-colors">Nosotros</Link>
          <Link href="/esmaltes-para-gres" className="hover:text-accent transition-colors">Esmaltes para GRES</Link>
        </nav>

        <div className="flex items-center gap-1">
          <IconButton href="/buscar" label="Buscar"><Search size={18} /></IconButton>
          <IconButton href="/cuenta/favoritos" label="Favoritos" className="hidden sm:inline-flex"><Heart size={18} /></IconButton>
          {status === "authenticated" ? (
            <div className="group relative hidden sm:inline-flex">
              <Link
                href="/cuenta"
                aria-label={`Cuenta de ${session.user?.name ?? session.user?.email}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent transition-colors hover:bg-accent hover:text-white"
              >
                {(session.user?.name ?? session.user?.email ?? "?").charAt(0).toUpperCase()}
              </Link>
              <div className="absolute right-0 top-full hidden pt-2 group-hover:block">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 whitespace-nowrap rounded-md bg-surface px-4 py-2.5 text-sm shadow-lg hover:bg-surface-muted"
                >
                  <LogOut size={14} /> Cerrar sesión
                </button>
              </div>
            </div>
          ) : (
            <IconButton href="/ingresar" label="Ingresar" className="hidden sm:inline-flex"><User size={18} /></IconButton>
          )}
          <IconButton href="/carrito" label="Carrito">
            <span className="relative">
              <ShoppingBag size={18} />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-white">
                  {count}
                </span>
              )}
            </span>
          </IconButton>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-bg lg:hidden">
          <div className="container flex h-16 items-center justify-between">
            <span className="font-display text-h3">SoloGlazes</span>
            <button aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} className="p-2">
              <X size={22} />
            </button>
          </div>
          <nav className="container flex flex-col gap-1 py-4 text-lg">
            {collections.map((c) => (
              <Link key={c.slug} href={`/catalogo/${c.slug}`} className="py-3 border-b border-border" onClick={() => setMenuOpen(false)}>
                {c.name}
              </Link>
            ))}
            <Link href="/guia" className="py-3 border-b border-border" onClick={() => setMenuOpen(false)}>Guía</Link>
            <Link href="/galeria" className="py-3 border-b border-border" onClick={() => setMenuOpen(false)}>Galería</Link>
            <Link href="/nosotros" className="py-3 border-b border-border" onClick={() => setMenuOpen(false)}>Nosotros</Link>
            <Link href="/esmaltes-para-gres" className="py-3 border-b border-border" onClick={() => setMenuOpen(false)}>Esmaltes para GRES</Link>
            <Link href="/cuenta" className="py-3 border-b border-border" onClick={() => setMenuOpen(false)}>Cuenta</Link>
            <Link href="/contacto" className="py-3" onClick={() => setMenuOpen(false)}>Contacto</Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function IconButton({
  href,
  label,
  children,
  className = "",
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-muted transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}
