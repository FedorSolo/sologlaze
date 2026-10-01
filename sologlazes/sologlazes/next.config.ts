import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.sologlazes.com.ar",
        pathname: "/cdn/shop/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  // Redirecciones 301 desde las URLs del viejo sitio de Shopify (que Google todavía recuerda
  // y sigue intentando visitar) hacia la página equivalente en el sitio nuevo. Esto recupera
  // cualquier visitante que llegue por un link viejo guardado, y le indica a Google que esas
  // URLs se movieron permanentemente — así deja de reportarlas como error 404.
  async redirects() {
    return [
      // Catálogo / colecciones
      { source: "/collections/all", destination: "/catalogo", permanent: true },
      { source: "/collections/:slug", destination: "/catalogo/:slug", permanent: true },
      { source: "/en/collections/:slug*", destination: "/catalogo/:slug*", permanent: true },

      // Fichas de producto (el slug de Shopify coincide con el slug actual)
      { source: "/products/:slug", destination: "/producto/:slug", permanent: true },
      { source: "/en/products/:slug", destination: "/producto/:slug", permanent: true },

      // Páginas sueltas con equivalente directo en el sitio nuevo
      { source: "/policies/terms-of-service", destination: "/terminos", permanent: true },
      { source: "/policies/privacy-policy", destination: "/privacidad", permanent: true },
      { source: "/policies/:slug", destination: "/terminos", permanent: true },
      { source: "/pages/preparacion-del-esmalte", destination: "/guia/como-aplicar", permanent: true },
      { source: "/pages/contacto", destination: "/contacto", permanent: true },
      { source: "/pages/:slug", destination: "/nosotros", permanent: true },
      { source: "/blogs/noticias/sobre-nosotros-sologlazes", destination: "/nosotros", permanent: true },
      { source: "/blogs/:category/:slug", destination: "/nosotros", permanent: true },
      { source: "/blogs/:category", destination: "/nosotros", permanent: true },

      // Cualquier otra ruta con prefijo /en/ que no haya matcheado arriba — se saca el prefijo
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
