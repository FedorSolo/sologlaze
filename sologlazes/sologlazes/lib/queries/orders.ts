import { prisma } from "@/lib/prisma";

const orderInclude = {
  items: { include: { variant: { include: { product: { include: { images: { take: 1 } } } } } } },
  shippingAddress: true,
  user: { select: { name: true, email: true, phone: true } },
} as const;

export async function getOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({ where: { id }, include: orderInclude });
}

export async function getOrderByNumber(orderNumber: string) {
  return prisma.order.findUnique({ where: { orderNumber }, include: orderInclude });
}

export async function getAllOrders() {
  return prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
}

// Convierte un Order de Prisma a la forma plana que ya consumen los componentes de UI
// (OrderStatusBadge, RepeatOrderButton, etc.) — evita tocar esos componentes.
export function toOrderView(order: NonNullable<Awaited<ReturnType<typeof getOrderById>>>) {
  return {
    id: order.orderNumber,
    dbId: order.id,
    date: order.createdAt.toISOString(),
    status: order.status,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    trackingNumber: order.trackingNumber ?? undefined,
    trackingCarrier: order.trackingCarrier ?? undefined,
    paymentProvider: order.paymentProvider,
    paymentStatus: order.paymentStatus,
    customerComment: order.customerComment ?? undefined,
    customerName: order.user?.name ?? undefined,
    customerEmail: order.user?.email ?? undefined,
    customerPhone: order.user?.phone ?? undefined,
    address: order.shippingAddress
      ? {
          street: order.shippingAddress.street,
          city: order.shippingAddress.city,
          province: order.shippingAddress.province,
          postalCode: order.shippingAddress.postalCode,
        }
      : undefined,
    items: order.items.map((item) => ({
      name: item.productNameSnapshot,
      variantLabel: item.variantLabelSnapshot ?? undefined,
      slug: item.variant?.product.slug ?? "",
      quantity: item.quantity,
      price: Number(item.unitPriceSnapshot),
      imageUrl: item.variant?.product.images[0]?.url ?? "/images/placeholder.jpg",
    })),
  };
}
