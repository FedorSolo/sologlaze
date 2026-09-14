"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "es" | "en" | "ru";

const dictionaries: Record<Lang, Record<string, string>> = {
  es: {
    catalogo: "Catálogo",
    guia: "Guía",
    nosotros: "Nosotros",
    gres: "Esmaltes para GRES",
    buscar: "Buscar",
    carrito: "Carrito",
    verCatalogo: "Ver catálogo",
    noSeQueElegir: "No sé qué elegir",
    badge: "Cono 5–6 · 1200°C · Listos para usar",
    nuestrasLineas: "Nuestras líneas",
    agregarAlCarrito: "Agregar al carrito",
  },
  en: {
    catalogo: "Catalog",
    guia: "Guide",
    nosotros: "About us",
    gres: "Stoneware Glazes",
    buscar: "Search",
    carrito: "Cart",
    verCatalogo: "View catalog",
    noSeQueElegir: "Help me choose",
    badge: "Cone 5–6 · 1200°C · Ready to use",
    nuestrasLineas: "Our lines",
    agregarAlCarrito: "Add to cart",
  },
  ru: {
    catalogo: "Каталог",
    guia: "Гид",
    nosotros: "О нас",
    gres: "Глазури для греса",
    buscar: "Поиск",
    carrito: "Корзина",
    verCatalogo: "Смотреть каталог",
    noSeQueElegir: "Не знаю, что выбрать",
    badge: "Конус 5–6 · 1200°C · Готовы к использованию",
    nuestrasLineas: "Наши линейки",
    agregarAlCarrito: "Добавить в корзину",
  },
};

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string }>({
  lang: "es",
  setLang: () => {},
  t: (key) => dictionaries.es[key] ?? key,
});

const STORAGE_KEY = "sologlazes:lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && dictionaries[saved]) setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
  };

  const t = (key: string) => dictionaries[lang][key] ?? dictionaries.es[key] ?? key;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
