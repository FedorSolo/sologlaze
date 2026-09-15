import { prisma } from "@/lib/prisma";
import { ResenasClient } from "@/components/admin/resenas-client";

export default async function AdminResenasPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-h1">Reseñas</h1>
      <ResenasClient
        reviews={reviews.map((r) => ({
          id: r.id,
          comment: r.comment,
          status: r.status,
          productName: r.product.name,
        }))}
      />
    </div>
  );
}
