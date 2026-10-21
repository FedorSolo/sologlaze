"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { LANGS, LANG_SHORT, LANG_NAMES, altPaths } from "@/lib/i18n-dict";

// Cada idioma es un link real a la misma página en ese idioma (así también lo siguen los buscadores).
export function LanguageSwitcher() {
  const { lang, t } = useLang();
  const pathname = usePathname();
  const alts = altPaths(pathname ?? "/");
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
        aria-label={t("cambiarIdioma")}
        aria-expanded={open}
      >
        <Globe size={16} /> {LANG_SHORT[lang]}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 w-28 rounded-md border border-border bg-surface py-1 shadow-lg">
          {LANGS.map((l) => (
            <Link
              key={l}
              href={alts[l]}
              hrefLang={l}
              onClick={() => setOpen(false)}
              className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-surface-muted ${l === lang ? "font-medium text-accent" : ""}`}
            >
              {LANG_NAMES[l]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
