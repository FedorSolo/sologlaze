"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayCircle } from "lucide-react";
import type { ProductDetail } from "@/lib/mock-data";

export function ProductGallery({ product }: { product: ProductDetail }) {
  const media = [
    ...product.images.map((img) => ({ kind: "image" as const, ...img })),
    ...(product.videoUrl ? [{ kind: "video" as const, url: product.videoUrl, alt: `Video de ${product.name}` }] : []),
  ];
  const [activeIndex, setActiveIndex] = useState(0);
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
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-muted">
          {active.kind === "video" ? (
            <video src={active.url} controls className="h-full w-full object-cover" aria-label={active.alt} />
          ) : (
            <Image src={active.url} alt={active.alt} fill priority className="object-cover" />
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
    </div>
  );
}
