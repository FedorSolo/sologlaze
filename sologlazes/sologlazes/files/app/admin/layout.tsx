import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "../globals.css";
import { AdminNav } from "@/components/admin/admin-nav";

const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-display", weight: ["300", "400", "500", "600", "700"], display: "swap" });

// Root layout propio para /admin: sin SiteHeader/SiteFooter del sitio público
// (antes vivía anidado bajo el layout público — ver README, ya resuelto).
export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · SoloGlazes Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={interTight.variable}>
      <body>
        <div className="flex min-h-screen flex-col lg:flex-row">
          <AdminNav />
          <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
