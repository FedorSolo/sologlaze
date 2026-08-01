import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "../globals.css";
import { AdminNav } from "@/components/admin/admin-nav";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

// Root layout propio para /admin: sin SiteHeader/SiteFooter del sitio público
// (antes vivía anidado bajo el layout público — ver README, ya resuelto).
export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · SoloGlazes Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <div className="flex min-h-screen">
          <AdminNav />
          <div className="flex-1 p-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
