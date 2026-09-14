"use client";

import { useLang, type Lang } from "@/lib/i18n";
import { Globe } from "lucide-react";
import { useState } from "react";

const labels: Record<Lang, string> = { es: "ES", en: "EN", ru: "RU" };

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
        aria-label="Cambiar idioma"
      >
        <Globe size={16} /> {labels[lang]}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-24 rounded-md border border-border bg-surface py-1 shadow-lg">
          {(Object.keys(labels) as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLang(l);
                setOpen(false);
              }}
              className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-surface-muted ${
                l === lang ? "font-medium text-accent" : ""
              }`}
            >
              {labels[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
