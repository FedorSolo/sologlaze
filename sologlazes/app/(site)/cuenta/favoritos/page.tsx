import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProductCards } from "@/lib/queries/products";
import { ProductCard } from "@/components/shop/product-card";

export default async function FavoritosPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/ingresar?callbackUrl=/cuenta/favoritos");

  const favoriteRows = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { product: { select: { slug: true } } },
  });
  const favoriteSlugs = new Set(favoriteRows.map((f) => f.product.slug));

  const allCards = await getProductCards();
  const favorites = allCards.filter((p) => favoriteSlugs.has(p.slug));

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Heart size={28} className="text-text-secondary" />
        <p className="text-h3">Todavía no tenés favoritos</p>
        <p className="max-w-xs text-sm text-text-secondary">Guardá los productos que te interesan para encontrarlos rápido.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
      {favorites.map((p) => (
        <ProductCard key={p.slug} product={p} />
      ))}
    </div>
  );
}
