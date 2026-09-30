"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { PlayCircle, ZoomIn, X } from "lucide-react";
import type { ProductDetail } from "@/lib/mock-data";

export function ProductGallery({ product }: { product: ProductDetail }) {
  const media = [
    ...product.images.map((img) => ({ kind: "image" as const, ...img })),
    ...(product.videoUrl ? [{ kind: "video" as const, url: product.videoUrl, alt: `Video de ${product.name}` }] : []),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  // Escape cierra la foto ampliada y se bloquea el scroll de fondo mientras está abierta.
  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [zoomOpen]);

  // Producto sin fotos ni video: no se rompe la página, se muestra un marcador.
  if (media.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-muted">
        <Image src="/images/placeholder.jpg" alt={`${product.name} — foto próximamente`} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
      </div>
    );
  }

  const active = media[Math.min(activeIndex, media.length - 1)];

  return (
    <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:gap-4">
      {/* Miniaturas — debajo de la foto en el celular, a la izquierda en escritorio */}
      {media.length > 1 && (
        <div className="order-2 flex shrink-0 gap-2 overflow-x-auto pb-1 lg:order-1 lg:flex-col lg:gap-3 lg:overflow-visible lg:pb-0">
          {media.map((m, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-md border transition-colors ${
                i === activeIndex ? "border-accent" : "border-border hover:border-border-strong"
              }`}
              aria-label={`Ver ${m.kind === "video" ? "video" : "imagen"} ${i + 1}`}
              aria-current={i === activeIndex}
            >
              {m.kind === "video" ? (
                <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                  <PlayCircle size={20} className="text-text-secondary" />
                </div>
              ) : (
                <Image src={m.url} alt="" fill sizes="64px" className="object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Foto / video principal */}
      <div className="order-1 min-w-0 flex-1 lg:order-2">
        <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-muted">
          {active.kind === "video" ? (
            <video src={active.url} controls playsInline preload="metadata" className="h-full w-full object-cover" aria-label={active.alt} />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="absolute inset-0 z-10 cursor-zoom-in"
                aria-label="Ampliar foto"
              />
              <Image
                src={active.url}
                alt={active.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-300 lg:group-hover:scale-105"
              />
              <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs text-text-primary opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                <ZoomIn size={14} /> Ampliar
              </span>
            </>
          )}
        </div>
      </div>

      {/* Foto ampliada a pantalla completa */}
      {zoomOpen && active.kind === "image" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto ampliada"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <X size={20} />
          </button>
          <div className="relative h-full max-h-[90dvh] w-full max-w-3xl">
            <Image src={active.url} alt={active.alt} fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
