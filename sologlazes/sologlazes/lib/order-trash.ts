import { prisma } from "@/lib/prisma";
import { reserveStock, restoreStock } from "@/lib/stock";

// Остатки списывают только заказы с сайта (SG-…). Ручные (M-…) и Mercado Libre (ML-…) склад не трогают.
export const tracksStock = (orderNumber: string) => !orderNumber.startsWith("M-") && !orderNumber.startsWith("ML-");

// Корзина заказов / Papelera de pedidos.
// «Удалить» больше не стирает заказ: он получает статус CANCELLED и запись в истории
// «🗑 В корзине (было: <статус>)». Из корзины заказ можно восстановить (вернётся прежний статус)
// или удалить навсегда. Схема базы не меняется.

export const TRASH_NOTE = "🗑 В корзине";
const OLD_NOTES = ["Удалена (отменена) из Telegram"]; // ранние «удалённые» ручные продажи

type Hist = { note: string | null; status: string; createdAt: Date };

export function isTrashed(o: { status: string; statusHistory?: Hist[] }) {
  if (o.status !== "CANCELLED" || !o.statusHistory?.length) return false;
  const last = [...o.statusHistory].sort((a, b) => +b.createdAt - +a.createdAt)[0];
  return Boolean(last.note && (last.note.startsWith(TRASH_NOTE) || OLD_NOTES.includes(last.note)));
}

/** ID заказов, которые сейчас в корзине. */
export async function trashedOrderIds(): Promise<Set<string>> {
  const rows = await prisma.order.findMany({
    where: { status: "CANCELLED", statusHistory: { some: { OR: [{ note: { startsWith: TRASH_NOTE } }, { note: { in: OLD_NOTES } }] } } },
    select: { id: true, status: true, statusHistory: { select: { note: true, status: true, createdAt: true } } },
  });
  return new Set(rows.filter(isTrashed).map((r) => r.id));
}

export async function moveToTrash(ids: string[], who: string) {
  const orders = await prisma.order.findMany({
    where: { id: { in: ids } },
    select: { id: true, status: true, orderNumber: true, items: { select: { variantId: true, quantity: true } } },
  });
  for (const o of orders) {
    await prisma.$transaction(async (tx) => {
      // как при отмене: единицы возвращаются на склад (если заказ ещё не был отменён)
      if (o.status !== "CANCELLED" && tracksStock(o.orderNumber)) await restoreStock(tx, o.items);
      await tx.order.update({
        where: { id: o.id },
        data: {
          status: "CANCELLED",
          statusHistory: { create: { status: "CANCELLED", changedBy: who, note: `${TRASH_NOTE} (было: ${o.status})` } },
        },
      });
    });
  }
  return orders.length;
}

export async function restoreFromTrash(ids: string[], who: string) {
  const orders = await prisma.order.findMany({
    where: { id: { in: ids } },
    select: {
      id: true, orderNumber: true, status: true,
      statusHistory: { select: { note: true, status: true, createdAt: true } },
      items: { select: { variantId: true, quantity: true, productNameSnapshot: true } },
    },
  });
  let n = 0;
  for (const o of orders) {
    if (!isTrashed(o)) continue;
    const last = [...o.statusHistory].sort((a, b) => +b.createdAt - +a.createdAt)[0];
    const prev = last.note?.match(/было: ([A-Z_]+)/)?.[1];
    const status = (prev ? prev : o.orderNumber.startsWith("M-") ? "DELIVERED" : "PENDING") as
      | "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
    await prisma.$transaction(async (tx) => {
      if (status !== "CANCELLED" && tracksStock(o.orderNumber)) {
        const labels = Object.fromEntries(o.items.filter((i) => i.variantId).map((i) => [i.variantId as string, i.productNameSnapshot]));
        await reserveStock(tx, o.items, labels); // нет остатка — OutOfStockError, заказ остаётся в корзине
      }
      await tx.order.update({
        where: { id: o.id },
        data: { status, statusHistory: { create: { status, changedBy: who, note: "Восстановлен из корзины" } } },
      });
    });
    n++;
  }
  return n;
}

/** Удалить навсегда — только то, что уже лежит в корзине. */
export async function purgeFromTrash(ids: string[]) {
  const trashed = await trashedOrderIds();
  const clean = ids.filter((id) => trashed.has(id));
  if (!clean.length) return 0;
  const orders = await prisma.order.findMany({ where: { id: { in: clean } }, select: { id: true, shippingAddressId: true } });
  const addressIds = Array.from(new Set(orders.map((o) => o.shippingAddressId)));
  await prisma.$transaction(async (tx) => {
    await tx.order.deleteMany({ where: { id: { in: orders.map((o) => o.id) } } });
    await tx.address.deleteMany({ where: { id: { in: addressIds }, userId: null, orders: { none: {} } } });
  });
  return orders.length;
}
