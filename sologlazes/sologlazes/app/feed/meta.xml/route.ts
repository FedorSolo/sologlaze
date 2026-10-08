import { prisma } from "@/lib/prisma";

// Feed de productos para el Catálogo de Meta (Facebook / Instagram).
// URL: https://sologlazes.com.ar/feed/meta.xml
// Cada peso (0.5 kg / 1 kg) sale como un ítem propio, agrupado por producto (item_group_id).
export const revalidate = 3600;

const BASE_URL = "https://sologlazes.com.ar";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absolute(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function money(v: unknown) {
  return `${Number(v).toFixed(2)} ARS`;
}

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null },
    orderBy: { createdAt: "asc" },
    include: {
      collection: { select: { name: true } },
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { price: "asc" }, include: { inventory: true } },
    },
  });

  const items: string[] = [];

  for (const p of products) {
    // Meta rechaza productos sin foto real: se omiten los que solo tienen la imagen provisoria.
    const photos = p.images.map((i) => i.url).filter((u) => u && !u.includes("placeholder"));
    if (photos.length === 0 || p.variants.length === 0) continue;

    // La descripción larga suele empezar con la corta: no se repite el comienzo.
    const short = p.shortDescription.trim();
    const long = p.description.trim();
    const joined = long.startsWith(short) || short.startsWith(long) ? (long.length >= short.length ? long : short) : `${short} ${long}`;
    const description = joined.replace(/\s+/g, " ").trim().slice(0, 4900);
    const link = `${BASE_URL}/producto/${p.slug}`;

    for (const v of p.variants) {
      const inStock = v.inventory ? v.inventory.status !== "OUT_OF_STOCK" && v.inventory.quantity > 0 : true;
      const hasSale = v.compareAtPrice && Number(v.compareAtPrice) > Number(v.price);

      items.push(`    <item>
      <g:id>${esc(v.sku)}</g:id>
      <g:item_group_id>${esc(p.slug)}</g:item_group_id>
      <g:title>${esc(p.variants.length > 1 ? `${p.name} — ${v.label}` : p.name)}</g:title>
      <g:description>${esc(description)}</g:description>
      <g:link>${esc(link)}</g:link>
      <g:image_link>${esc(absolute(photos[0]))}</g:image_link>${photos
        .slice(1, 10)
        .map((u) => `\n      <g:additional_image_link>${esc(absolute(u))}</g:additional_image_link>`)
        .join("")}
      <g:availability>${inStock ? "in stock" : "out of stock"}</g:availability>
      <g:condition>new</g:condition>
      <g:price>${money(hasSale ? v.compareAtPrice : v.price)}</g:price>${hasSale ? `\n      <g:sale_price>${money(v.price)}</g:sale_price>` : ""}
      <g:brand>SoloGlazes</g:brand>
      <g:product_type>${esc(p.collection.name)}</g:product_type>
    </item>`);
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>SoloGlazes</title>
    <link>${BASE_URL}</link>
    <description>Esmaltes cerámicos en polvo — SoloGlazes</description>
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
