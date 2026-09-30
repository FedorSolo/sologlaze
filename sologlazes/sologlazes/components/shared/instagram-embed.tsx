"use client";

import { useEffect } from "react";
import Script from "next/script";

export function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    // @ts-expect-error — instgrm se inyecta globalmente por el script de Instagram
    if (window.instgrm) window.instgrm.Embeds.process();
  }, []);

  return (
    <div className="w-full min-w-0 max-w-[540px] overflow-hidden">
      <blockquote
        className="instagram-media mx-auto"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: "#FFF", border: 0, margin: "0 auto", maxWidth: 540, width: "100%" }}
      />
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error — instgrm se inyecta globalmente
          if (window.instgrm) window.instgrm.Embeds.process();
        }}
      />
    </div>
  );
}
