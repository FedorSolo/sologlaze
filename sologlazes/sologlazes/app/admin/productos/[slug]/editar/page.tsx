import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCollections } from "@/lib/queries/collections";
import { EditProductForm } from "@/components/admin/edit-product-form";

export default async function EditProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [product, collections] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        variants: { include: { inventory: true } },
        images: { orderBy: { sortOrder: "asc" } },
        videos: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    }),
    getCollections(),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="mb-6 text-h1">Editar: {product.name}</h1>
      <EditProductForm
        productId={product.id}
        collections={collections.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          name: product.name,
          collectionId: product.collectionId,
          shortDescription: product.shortDescription,
          description: product.description,
          applicationInstructions: product.applicationInstructions,
          isActive: product.isActive,
          variants: product.variants.map((v) => ({
            id: v.id,
            label: v.label,
            price: Number(v.price),
            compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
            stockQuantity: v.inventory?.quantity ?? 0,
          })),
          imageUrls: product.images.map((img) => img.url),
          videoUrl: product.videos[0]?.url,
        }}
      />
    </div>
  );
}
