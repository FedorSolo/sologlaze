"use client";

import { useEffect } from "react";
import { IGNORE_KEY } from "@/lib/analytics-client";

// Marca este navegador como "del dueño" para que sus visitas no ensucien la analítica.
export function IgnoreMe() {
  useEffect(() => {
    try {
      window.localStorage.setItem(IGNORE_KEY, "1");
    } catch {
      // nada
    }
  }, []);
  return null;
}
