import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/shop/site-header";
import { SiteFooter } from "@/components/shop/site-footer";
import { CartProvider } from "@/lib/cart-context";
import { AuthSessionProvider } from "@/lib/session-provider";
import { LangProvider } from "@/lib/i18n";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sologlazes.com.ar"),
  title: {
    default: "SoloGlazes — Esmaltes cerámicos listos para usar",
    template: "%s · SoloGlazes",
  },
  description:
    "Esmaltes cerámicos para cono 5–6 (1200°C), listos para aplicar. Cristalina, Floating y GRRR — el efecto que buscás en tu pieza, sin tamizar ni mezclar.",
  openGraph: {
    siteName: "SoloGlazes",
    type: "website",
    locale: "es_AR",
    url: "https://sologlazes.com.ar",
  },
  twitter: { card: "summary_large_image" },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SoloGlazes",
  url: "https://sologlazes.com.ar",
  logo: "https://sologlazes.com.ar/images/logo-solo.png",
  areaServed: "AR",
  sameAs: ["https://instagram.com", "https://wa.me/5491127379589"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={interTight.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <LangProvider>
          <AuthSessionProvider>
            <CartProvider>
              <SiteHeader />
              <main>{children}</main>
              <SiteFooter />
            </CartProvider>
          </AuthSessionProvider>
        </LangProvider>
      </body>
    </html>
  );
}
