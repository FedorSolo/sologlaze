"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics-client";

// Se monta en la página de confirmación. El servidor ignora repetidos del mismo pedido.
export function TrackPurchase({ orderNumber, total }: { orderNumber: string; total: number }) {
  useEffect(() => {
    track("purchase", { label: orderNumber, value: Math.round(total) });
  }, [orderNumber, total]);
  return null;
}
