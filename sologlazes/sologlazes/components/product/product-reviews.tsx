import Image from "next/image";
import { Star } from "lucide-react";
import type { ProductDetail } from "@/lib/mock-data";

export function ProductReviews({ reviews }: { reviews: ProductDetail["reviews"] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-text-secondary">
        Todavía no hay reseñas para este producto. ¿Ya lo probaste? Contanos cómo te fue.
      </p>
    );
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center gap-1 text-status-warning">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} fill={i < Math.round(avg) ? "currentColor" : "none"} />
          ))}
        </div>
        <span className="text-sm text-text-secondary">
          {avg.toFixed(1)} · {reviews.length} reseña{reviews.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-6">
        {reviews.map((r) => (
          <div key={r.id} className="border-b border-border pb-6 last:border-0">
            <div className="mb-1 flex items-center gap-2">
              <div className="flex text-status-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} fill={i < r.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm font-medium">{r.author}</span>
            </div>
            <p className="mb-2 text-sm text-text-secondary">{r.comment}</p>
            {r.imageUrl && (
              <div className="relative h-20 w-20 overflow-hidden rounded-md">
                <Image src={r.imageUrl} alt={`Foto adjunta por ${r.author}`} fill className="object-cover" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
