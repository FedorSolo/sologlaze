import type { Metadata } from "next";
import { BASE_URL, LANGS, OG_LOCALE, altPaths, type Lang } from "@/lib/i18n-dict";

// hreflang + canonical: cada idioma apunta a sí mismo y a sus equivalentes.
// `path` es la ruta en español (sin prefijo), por ejemplo "/producto/cristalina-miel".
export function languageAlternates(path: string, lang: Lang) {
  const paths = altPaths(path);
  return {
    canonical: `${BASE_URL}${paths[lang] === "/" ? "" : paths[lang]}`,
    languages: {
      es: `${BASE_URL}${paths.es === "/" ? "" : paths.es}`,
      en: `${BASE_URL}${paths.en}`,
      ru: `${BASE_URL}${paths.ru}`,
      "x-default": `${BASE_URL}${paths.es === "/" ? "" : paths.es}`,
    },
  } satisfies NonNullable<Metadata["alternates"]>;
}

export function ogLocales(lang: Lang) {
  return { locale: OG_LOCALE[lang], alternateLocale: LANGS.filter((l) => l !== lang).map((l) => OG_LOCALE[l]) };
}

export function absoluteUrl(path: string) {
  return `${BASE_URL}${path === "/" ? "" : path}`;
}
