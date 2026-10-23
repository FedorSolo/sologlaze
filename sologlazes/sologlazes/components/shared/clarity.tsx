"use client";

import { useEffect } from "react";
import { IGNORE_KEY } from "@/lib/analytics-client";

// Microsoft Clarity: grabaciones de visitas, mapas de calor y detección de clics muertos / repetidos.
// El ID llega como prop desde el layout (CLARITY_ID o NEXT_PUBLIC_CLARITY_ID). Solo se activa si existe, no carga en el navegador del dueño ni con "No rastrear".
export function Clarity({ id: ID }: { id?: string }) {
  useEffect(() => {
    if (!ID) return;
    try {
      if (window.localStorage.getItem(IGNORE_KEY) === "1") return;
    } catch {
      // sin almacenamiento: seguimos
    }
    if (navigator.doNotTrack === "1") return;

    type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
    const w = window as unknown as { clarity?: ClarityFn };
    if (w.clarity) return;
    const clarity: ClarityFn = (...args: unknown[]) => {
      (clarity.q = clarity.q ?? []).push(args);
    };
    w.clarity = clarity;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${ID}`;
    document.head.appendChild(s);
  }, [ID]);

  return null;
}
