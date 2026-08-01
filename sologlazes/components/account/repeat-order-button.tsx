"use client";

import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { useCart } from "@/lib/cart-context";

type OrderForRepeat = {
  items: { slug: string; name: string; price: number; imageUrl: string; quantity: number }[];
};

export function RepeatOrderButton({ order }: { order: OrderForRepeat }) {
  const { add } = useCart();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        order.items.forEach((item) =>
          add({ slug: item.slug, name: item.name, price: item.price, imageUrl: item.imageUrl }, item.quantity)
        );
        router.push("/carrito");
      }}
      className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
    >
      <RefreshCcw size={16} /> Repetir pedido
    </button>
  );
}
