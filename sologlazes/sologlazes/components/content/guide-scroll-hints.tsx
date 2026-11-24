"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

/**
 * Flechas flotantes para la guía: quien llega desde el QR cae en el medio de la página
 * (proporciones) y necesita ver que hay contenido arriba (video, temperaturas) y abajo.
 */
export function GuideScrollHints() {
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(true);

  useEffect(() => {
    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setCanUp(y > 160);
      setCanDown(y < max - 160);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", () => setTimeout(update, 400));
    const t = setTimeout(update, 600); // después del salto al ancla
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      clearTimeout(t);
    };
  }, []);

  const btn =
    "pointer-events-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/95 px-4 py-2 text-sm font-medium text-text-primary shadow-md backdrop-blur transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex flex-col items-center gap-2 px-4">
      {canUp && (
        <a href="#top-guia" className={btn} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          <ArrowUp size={16} /> Arriba: video y temperaturas
        </a>
      )}
      {canDown && (
        <a href="#cristalina-floating-grrr" className={btn}>
          <ArrowDown size={16} /> Abajo: más información
        </a>
      )}
    </div>
  );
}
