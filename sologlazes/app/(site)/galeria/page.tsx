import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Galería",
  description: "Piezas terminadas por nuestra comunidad de keramistas con esmaltes SoloGlazes.",
};

// Prototipo — en producción viene de GalleryImage (status: APPROVED)
const images = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  url: `/images/gallery-placeholder-${(i % 4) + 1}.jpg`,
  productSlug: i % 2 === 0 ? "esmalte-floating-blanco-nube" : "esmalte-grrr-negro-lava",
}));

export default function GaleriaPage() {
  return (
    <div className="container py-10 lg:py-14">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-text-secondary">
        Inicio / Galería
      </nav>
      <h1 className="mb-2 text-h1 lg:text-h1-lg">Piezas de nuestra comunidad</h1>
      <p className="mb-10 max-w-xl text-body-lg text-text-secondary">
        Fotos reales de keramistas que usaron esmaltes SoloGlazes en sus piezas. ¿Tenés una foto para
        compartir? Escribinos por WhatsApp o Instagram.
      </p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((img) => (
          <Link
            key={img.id}
            href={`/producto/${img.productSlug}`}
            className="group relative aspect-square overflow-hidden rounded-md bg-surface-muted"
          >
            <Image
              src={img.url}
              alt="Pieza de cerámica de un cliente terminada con esmalte SoloGlazes"
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
