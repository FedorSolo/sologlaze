import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { moderateGalleryImageAction } from "@/lib/actions/admin-gallery";

export default async function AdminGaleriaPage() {
  const images = await prisma.galleryImage.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-h1">Galería</h1>
      {images.length === 0 ? (
        <p className="text-sm text-text-secondary">
          Todavía no hay imágenes enviadas. Se popularán cuando haya subidas del sitio, Instagram o WhatsApp (campo `source` en GalleryImage).
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="overflow-hidden rounded-md border border-border">
              <div className="relative aspect-square bg-surface-muted">
                <Image src={img.url} alt={img.caption ?? "Foto de galería"} fill className="object-cover" />
              </div>
              <div className="p-3">
                <p className="mb-1 text-xs text-text-secondary">{img.product?.name ?? "Sin producto"} · {img.source}</p>
                <div className="flex gap-2">
                  <form action={moderateGalleryImageAction.bind(null, img.id, "APPROVED")}>
                    <button className="rounded-full border border-status-success px-2 py-1 text-xs text-status-success">Aprobar</button>
                  </form>
                  <form action={moderateGalleryImageAction.bind(null, img.id, "REJECTED")}>
                    <button className="rounded-full border border-status-error px-2 py-1 text-xs text-status-error">Rechazar</button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
