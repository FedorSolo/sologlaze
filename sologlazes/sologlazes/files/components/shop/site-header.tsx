"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, User, ShoppingBag, Menu, X, LogOut, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useLang, type Lang } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/shop/language-switcher";

const collections = [
  { slug: "cristalina", name: "Cristalina" },
  { slug: "floating", name: "Floating" },
  { slug: "grrr", name: "GRRR" },
  { slug: "pack-prueba", name: "Pack Prueba" },
];

const langs: { code: Lang; label: string }[] = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();
  const { data: session, status } = useSession();
  const { t, lang, setLang } = useLang();

  // Con el menú abierto: se bloquea el scroll de la página de atrás y Escape lo cierra.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const mobileLink = "block border-b border-border py-3.5 text-lg";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bg transition-colors">
        <div className="container flex h-16 items-center justify-between gap-3 xl:h-20">
          <button
            type="button"
            className="-ml-2 p-2 text-text-primary xl:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="flex shrink-0 items-center" aria-label="SoloGlazes — inicio">
            <Image
              src="/images/logo-sologlazes.png"
              alt="SoloGlazes"
              width={220}
              height={62}
              className="h-8 w-auto sm:h-9 xl:h-11"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-8 whitespace-nowrap text-sm xl:flex">
            <div className="group relative">
              <Link href="/catalogo" className="transition-colors hover:text-accent">{t("catalogo")}</Link>
              <div className="absolute left-0 top-full hidden pt-4 group-hover:block">
                <div className="flex gap-2 rounded-lg border border-border bg-surface p-3">
                  {collections.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/catalogo/${c.slug}`}
                      className="whitespace-nowrap rounded-md px-4 py-2 text-sm transition-all duration-150 hover:scale-105 hover:bg-surface-muted hover:text-accent"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/guia" className="transition-colors hover:text-accent">{t("guia")}</Link>
            <Link href="/nosotros" className="transition-colors hover:text-accent">{t("nosotros")}</Link>
            <Link href="/coworking" className="transition-colors hover:text-accent">Coworking</Link>
            <Link href="/esmaltes-para-gres" className="transition-colors hover:text-accent">{t("gres")}</Link>
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden sm:mr-2 sm:flex">
              <LanguageSwitcher />
            </div>
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
                    className="flex items-center gap-2 whitespace-nowrap rounded-md border border-border bg-surface px-4 py-2.5 text-sm hover:bg-surface-muted"
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
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-none text-white">
                    {count}
                  </span>
                )}
              </span>
            </IconButton>
          </div>
        </div>
      </header>

      {/* Menú del celular — FUERA del <header>: el backdrop-blur del header haría que este panel
          quedara recortado a la altura de la barra en vez de cubrir toda la pantalla. */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg xl:hidden" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="container flex h-16 shrink-0 items-center justify-between">
            <Link href="/" onClick={close} aria-label="SoloGlazes — inicio">
              <Image src="/images/logo-sologlazes.png" alt="SoloGlazes" width={220} height={62} className="h-8 w-auto" />
            </Link>
            <button type="button" aria-label="Cerrar menú" onClick={close} className="-mr-2 p-2">
              <X size={22} />
            </button>
          </div>

          <nav className="container flex flex-1 flex-col pb-10 pt-2">
            <p className="pb-1 pt-2 text-caption uppercase tracking-wide text-text-secondary">Catálogo</p>
            <Link href="/catalogo" className={mobileLink} onClick={close}>Ver todos los esmaltes</Link>
            {collections.map((c) => (
              <Link key={c.slug} href={`/catalogo/${c.slug}`} className={`${mobileLink} pl-4 text-base`} onClick={close}>
                {c.name}
              </Link>
            ))}

            <p className="pb-1 pt-6 text-caption uppercase tracking-wide text-text-secondary">Más</p>
            <Link href="/guia" className={mobileLink} onClick={close}>{t("guia")}</Link>
            <Link href="/nosotros" className={mobileLink} onClick={close}>{t("nosotros")}</Link>
            <Link href="/coworking" className={mobileLink} onClick={close}>Coworking</Link>
            <Link href="/esmaltes-para-gres" className={mobileLink} onClick={close}>{t("gres")}</Link>
            <Link href="/contacto" className={mobileLink} onClick={close}>Contacto</Link>

            <p className="pb-1 pt-6 text-caption uppercase tracking-wide text-text-secondary">Mi cuenta</p>
            {status === "authenticated" ? (
              <>
                <Link href="/cuenta" className={mobileLink} onClick={close}>Mi cuenta</Link>
                <Link href="/cuenta/favoritos" className={mobileLink} onClick={close}>Favoritos</Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 border-b border-border py-3.5 text-left text-lg"
                >
                  <LogOut size={18} /> Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/ingresar" className={mobileLink} onClick={close}>Ingresar o registrarme</Link>
            )}

            <p className="pb-2 pt-6 text-caption uppercase tracking-wide text-text-secondary">Idioma</p>
            <div className="flex gap-2">
              {langs.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLang(l.code)}
                  className={`flex-1 rounded-full border px-3 py-2.5 text-sm transition-colors ${
                    lang === l.code ? "border-accent bg-accent text-white" : "border-border hover:bg-surface-muted"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <a
              href="https://wa.me/5491127379589"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-white"
            >
              <MessageCircle size={16} /> Escribinos por WhatsApp
            </a>
          </nav>
        </div>
      )}
    </>
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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-muted ${className}`}
    >
      {children}
    </Link>
  );
}
