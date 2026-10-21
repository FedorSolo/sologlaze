import type { Metadata } from "next";
import { ProductView, productMetadata } from "@/components/pages/product-view";
import { prisma } from "@/lib/prisma";

// Sin esto, cada visita a una ficha de producto consultaba la base desde cero (Next 15 no cachea
// fetch por defecto) y no había nada prerenderizado — por eso la navegación se sentía "colgada".
export const revalidate = 60;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ where: { isActive: true, deletedAt: null }, select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return productMetadata(slug, "es");
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductView slug={slug} lang="es" />;
}
