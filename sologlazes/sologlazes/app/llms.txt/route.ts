import { getProductCards } from "@/lib/queries/products";

export const revalidate = 3600;

const BASE = "https://sologlazes.com.ar";

// llms.txt: resumen en texto plano del sitio para buscadores y asistentes con IA.
export async function GET() {
  let products: Awaited<ReturnType<typeof getProductCards>> = [];
  try {
    products = await getProductCards(undefined, "es");
  } catch {
    products = [];
  }

  const lines = [
    "# SoloGlazes",
    "",
    "> Esmaltes cerámicos en polvo para alta temperatura (cono 5–6, 1200 °C), para gres y vajilla, hechos en Buenos Aires, Argentina. Cada esmalte trae sus modificadores incluidos y proporciones exactas de agua. Envíos a toda Argentina.",
    "",
    "## Qué vendemos",
    "- Cristalina: esmalte cerámico para alta temperatura con efecto de cristales abiertos y terminación brillante. Colores: Miel, Gris, Rosado-Marrón, Lavanda, Verde. Presentaciones de 500 g y 1 kg. Apto para vajilla y lavavajillas cocido correctamente.",
    "- Floating: esmalte para gres con manchas flotantes y degradé natural. Colores: Verde, Verde Grisáceo, Celeste, Azul, Gris Oscuro, Menta, Rosa Crema. Presentaciones de 500 g y 1 kg.",
    "- GRRR: texturas de pelaje animal (Fuego, Leopardo de las Nieves, Pantera Rosa). Se aplica en dos capas: base y esmalte superior.",
    "- Pack Prueba: 5 esmaltes de 200 g a elección (Cristalina y Floating) para probar colores antes de comprar un kilo.",
    "",
    "## Páginas principales",
    `- [Esmaltes para gres de alta temperatura](${BASE}/esmaltes-para-gres): guía y catálogo de esmaltes para gres, cono 5–6.`,
    `- [Catálogo completo](${BASE}/catalogo)`,
    `- [Cristalina](${BASE}/catalogo/cristalina)`,
    `- [Floating](${BASE}/catalogo/floating)`,
    `- [GRRR](${BASE}/catalogo/grrr)`,
    `- [Pack Prueba](${BASE}/catalogo/pack-prueba)`,
    `- [Guía de aplicación](${BASE}/guia/como-aplicar)`,
    `- [Temperaturas y conos](${BASE}/guia/temperaturas-y-conos)`,
    `- [Envíos y devoluciones](${BASE}/envios-y-devoluciones)`,
    `- [Contacto](${BASE}/contacto)`,
    "",
    "## Idiomas",
    `- Español (principal): ${BASE}`,
    `- English: ${BASE}/en`,
    `- Русский: ${BASE}/ru`,
  ];

  if (products.length) {
    lines.push("", "## Productos");
    for (const p of products) lines.push(`- [${p.name}](${BASE}/producto/${p.slug})`);
  }

  lines.push("", "## Datos de contacto", `- Sitio: ${BASE}`, "- También en Mercado Libre: tienda SOLOGLAZES.", "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
