"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track, trackPageview } from "@/lib/analytics-client";

// Cuenta las visitas y los clics a WhatsApp / Mercado Libre / Instagram. No muestra nada en pantalla.
export function Analytics() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackPageview(pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.href.toLowerCase();
      const page = window.location.pathname;
      if (href.includes("wa.me/") || href.includes("api.whatsapp.com")) track("whatsapp_click", { label: page });
      else if (href.includes("mercadolibre.com")) track("ml_click", { label: page });
      else if (href.includes("instagram.com")) track("instagram_click", { label: page });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
