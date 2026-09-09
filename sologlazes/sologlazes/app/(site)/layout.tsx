import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/shop/site-header";
import { SiteFooter } from "@/components/shop/site-footer";
import { CartProvider } from "@/lib/cart-context";
import { AuthSessionProvider } from "@/lib/session-provider";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SoloGlazes — Esmaltes cerámicos listos para usar",
    template: "%s · SoloGlazes",
  },
  description:
    "Esmaltes cerámicos para cono 5–6 (1200°C), listos para aplicar. Cristalina, Floating y GRRR — el efecto que buscás en tu pieza, sin tamizar ni mezclar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={interTight.variable}>
      <body>
        <AuthSessionProvider>
          <CartProvider>
            <SiteHeader />
            <main>{children}</main>
            <SiteFooter />
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
