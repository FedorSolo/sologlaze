import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lista de esmaltes que se pueden elegir para el Pack Prueba — todas las series excepto GRRR,
// según dice la propia descripción del producto. Se consulta en vivo para que siempre refleje
// el catálogo actual (si se agrega o saca un color, la lista se actualiza sola).
export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null, collection: { slug: { not: "grrr" } } },
    select: { name: true, collection: { select: { name: true } } },
    orderBy: [{ collection: { sortOrder: "asc" } }, { name: "asc" }],
  });
  return NextResponse.json(products.map((p) => `${p.collection.name} — ${p.name}`));
}
