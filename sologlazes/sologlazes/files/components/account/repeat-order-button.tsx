"use client";

import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { useCart, parseWeightKg } from "@/lib/cart-context";

type OrderForRepeat = {
  items: {
    variantId?: string;
    slug: string;
    name: string;
    variantLabel?: string;
    price: number;
    imageUrl: string;
    quantity: number;
  }[];
};

export function RepeatOrderButton({ order }: { order: OrderForRepeat }) {
  const { add } = useCart();
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        // Solo se pueden repetir presentaciones que siguen existiendo en el catálogo.
        order.items
          .filter((item) => item.variantId)
          .forEach((item) =>
            add(
              {
                variantId: item.variantId!,
                slug: item.slug,
                name: item.name,
                variantLabel: item.variantLabel,
                price: item.price,
                imageUrl: item.imageUrl,
              },
              item.quantity,
              parseWeightKg(item.variantLabel)
            )
          );
        router.push("/carrito");
      }}
      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
    >
      <RefreshCcw size={16} /> Repetir pedido
    </button>
  );
}
