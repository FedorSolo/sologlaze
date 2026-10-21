"use client";

import { useEffect } from "react";

// El <html> del sitio se define una sola vez en el layout (lang="es"); en las páginas /en y /ru
// se corrige el atributo en el navegador para lectores de pantalla y traductores.
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = prev;
    };
  }, [lang]);
  return null;
}
