import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/shop/site-header";
import { SiteFooter } from "@/components/shop/site-footer";
import { CartProvider } from "@/lib/cart-context";
import { AuthSessionProvider } from "@/lib/session-provider";
import { LangProvider } from "@/lib/i18n";

// MAKR usa Sohne (de pago) — Inter es la alternativa que la propia guía de estilo sugiere.
// Solo peso 400: la jerarquía se lee en tamaño y tracking, nunca en negrita.
const interDisplay = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sologlazes.com.ar"),
  title: {
    default: "SoloGlazes — Esmaltes cerámicos en polvo",
    template: "%s · SoloGlazes",
  },
  description:
    "Esmaltes cerámicos en polvo para cono 5–6 (1200°C). Se preparan mezclando con agua según proporciones exactas, con modificadores que mejoran la aplicación sobre el bizcocho. Cristalina, Floating y GRRR.",
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
  logo: "https://sologlazes.com.ar/images/logo-sologlazes.png",
  areaServed: "AR",
  sameAs: ["https://instagram.com/sologlazes.arg", "https://wa.me/5491127379589"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={interDisplay.variable}>
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
