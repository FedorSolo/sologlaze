// Este archivo ya no contiene datos de muestra — todo el catálogo real vive en la
// base de datos (ver prisma/seed.ts, con los textos/precios/fotos tomados directamente
// de sologlazes.com.ar). Lo único que queda acá son tipos compartidos por los
// componentes de producto, para no crear un ciclo de imports con lib/queries/products.ts.

export type ProductDetail = {
  slug: string;
  name: string;
  collection: { slug: "cristalina" | "floating" | "grrr"; name: string };
  price: number;
  currency: string;
  shortDescription: string;
  description: string;
  applicationInstructions: string;
  inStock: boolean;
  attributes: { label: string; value: string }[];
  variants?: { id: string; label: string; price: number }[];
  images: { url: string; alt: string; type: "ON_PIECE" | "TEXTURE_DETAIL" | "PACKAGING" }[];
  videoUrl?: string;
  reviews: { id: string; author: string; rating: number; comment: string; imageUrl?: string }[];
};
