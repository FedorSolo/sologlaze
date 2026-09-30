import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Lista de esmaltes que se pueden elegir para el Pack Prueba — todas las series excepto GRRR
// (según la descripción del producto) y excepto el propio Pack Prueba (no tiene sentido que
// se pueda "elegir" el pack dentro de sí mismo). Se consulta en vivo para reflejar el catálogo actual.
export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true, deletedAt: null, collection: { slug: { notIn: ["grrr", "pack-prueba"] } } },
    select: { name: true, collection: { select: { name: true } } },
    orderBy: [{ collection: { sortOrder: "asc" } }, { name: "asc" }],
  });
  return NextResponse.json(products.map((p) => `${p.collection.name} — ${p.name}`));
}
