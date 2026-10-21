"use client";

import { usePathname } from "next/navigation";
import { hrefFor, langFromPath, tr, type Lang } from "@/lib/i18n-dict";

export type { Lang };

// El idioma sale de la URL (/en, /ru o español sin prefijo): así Google ve cada idioma como su
// propia página y el selector de idioma son links normales.
export function useLang() {
  const pathname = usePathname();
  const lang = langFromPath(pathname);
  return {
    lang,
    t: (key: string, vars?: Record<string, string | number>) => tr(lang, key, vars),
    href: (path: string) => hrefFor(lang, path),
  };
}

// Se mantiene por compatibilidad con el layout: ya no guarda estado.
export function LangProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
