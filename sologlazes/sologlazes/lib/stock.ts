import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;
export type StockItem = { variantId: string | null; quantity: number };

/** Error de negocio: no hay unidades suficientes de una presentación. */
export class OutOfStockError extends Error {
  constructor(public readonly label: string) {
    super(`Sin stock suficiente de ${label}.`);
    this.name = "OutOfStockError";
  }
}

// Junta líneas repetidas de la misma presentación en una sola.
function aggregate(items: StockItem[]) {
  const map = new Map<string, number>();
  for (const i of items) {
    if (!i.variantId) continue;
    map.set(i.variantId, (map.get(i.variantId) ?? 0) + i.quantity);
  }
  return map;
}

/**
 * Descuenta stock dentro de una transacción. Si alguna presentación no tiene unidades suficientes
 * lanza OutOfStockError y la transacción completa se revierte (no queda nada a medias).
 * Las presentaciones sin registro de inventario no controlan stock y se dejan pasar.
 */
export async function reserveStock(tx: Tx, items: StockItem[], labels: Record<string, string>) {
  const wanted = aggregate(items);
  if (wanted.size === 0) return;
  // Una sola consulta para todos los inventarios (antes eran 3 consultas por producto → timeout con carritos grandes).
  const invs = await tx.inventory.findMany({ where: { variantId: { in: [...wanted.keys()] } }, select: { variantId: true } });
  const tracked = new Set(invs.map((i) => i.variantId));
  const toZero: string[] = [];
  for (const [variantId, qty] of wanted) {
    if (!tracked.has(variantId)) continue;
    const res = await tx.inventory.updateMany({
      where: { variantId, quantity: { gte: qty } },
      data: { quantity: { decrement: qty } },
    });
    if (res.count === 0) throw new OutOfStockError(labels[variantId] ?? "un producto");
    toZero.push(variantId);
  }
  if (toZero.length > 0) {
    await tx.inventory.updateMany({ where: { variantId: { in: toZero }, quantity: 0 }, data: { status: "OUT_OF_STOCK" } });
  }
}

/** Devuelve al stock las unidades de un pedido (por ejemplo al cancelarlo). */
export async function restoreStock(tx: Tx, items: StockItem[]) {
  for (const [variantId, qty] of aggregate(items)) {
    const inv = await tx.inventory.findUnique({ where: { variantId } });
    if (!inv) continue;
    await tx.inventory.update({
      where: { variantId },
      data: { quantity: { increment: qty }, status: "IN_STOCK" },
    });
  }
}
