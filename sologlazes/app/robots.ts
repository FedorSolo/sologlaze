import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/cuenta", "/checkout", "/carrito", "/api"],
    },
    sitemap: "https://sologlazes.com.ar/sitemap.xml",
  };
}
