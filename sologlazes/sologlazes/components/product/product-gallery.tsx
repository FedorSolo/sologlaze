"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayCircle, ZoomIn, X } from "lucide-react";
import type { ProductDetail } from "@/lib/mock-data";

export function ProductGallery({ product }: { product: ProductDetail }) {
  const media = [
    ...product.images.map((img) => ({ kind: "image" as const, ...img })),
    ...(product.videoUrl ? [{ kind: "video" as const, url: product.videoUrl, alt: `Video de ${product.name}` }] : []),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const active = media[activeIndex];

  return (
    <div className="lg:flex lg:gap-4">
      {/* Thumbnails — desktop */}
      <div className="hidden shrink-0 flex-col gap-3 lg:flex">
        {media.map((m, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative h-20 w-16 overflow-hidden rounded-md border transition-colors ${
              i === activeIndex ? "border-accent" : "border-border hover:border-border-strong"
            }`}
            aria-label={`Ver ${m.kind === "video" ? "video" : "imagen"} ${i + 1}`}
          >
            {m.kind === "video" ? (
              <div className="flex h-full w-full items-center justify-center bg-surface-muted">
                <PlayCircle size={20} className="text-text-secondary" />
              </div>
            ) : (
              <Image src={m.url} alt="" fill className="object-cover" />
            )}
          </button>
        ))}
      </div>

      {/* Main media */}
      <div className="relative flex-1">
        <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-muted">
          {active.kind === "video" ? (
            <video src={active.url} controls className="h-full w-full object-cover" aria-label={active.alt} />
          ) : (
            <>
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="absolute inset-0 z-10 cursor-zoom-in"
                aria-label="Ampliar foto"
              >
                <span className="sr-only">Ampliar foto</span>
              </button>
              <Image src={active.url} alt={active.alt} fill priority className="object-cover transition-transform duration-300 group-hover:scale-105" />
              <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs text-text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn size={14} /> Ampliar
              </span>
            </>
          )}
        </div>

        {/* Dots — mobile */}
        <div className="mt-3 flex justify-center gap-1.5 lg:hidden">
          {media.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a ${i + 1}`}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-border-strong"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox — foto ampliada a pantalla completa */}
      {zoomOpen && active.kind === "image" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setZoomOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
          <div className="relative h-full max-h-[90vh] w-full max-w-3xl">
            <Image src={active.url} alt={active.alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
