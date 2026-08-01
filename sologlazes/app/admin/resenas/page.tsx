import { prisma } from "@/lib/prisma";
import { moderateReviewAction } from "@/lib/actions/admin-orders";

export default async function AdminResenasPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-h1">Reseñas</h1>
      {reviews.length === 0 ? (
        <p className="text-sm text-text-secondary">Todavía no hay reseñas.</p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 p-4 text-sm">
              <div>
                <p className="font-medium">
                  {r.product.name}{" "}
                  <span className="ml-2 rounded-full bg-surface-muted px-2 py-0.5 text-xs text-text-secondary">{r.status}</span>
                </p>
                <p className="text-text-secondary">{r.comment}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <form action={moderateReviewAction.bind(null, r.id, "APPROVED")}>
                  <button className="rounded-full border border-status-success px-3 py-1 text-status-success">Aprobar</button>
                </form>
                <form action={moderateReviewAction.bind(null, r.id, "REJECTED")}>
                  <button className="rounded-full border border-status-error px-3 py-1 text-status-error">Rechazar</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
