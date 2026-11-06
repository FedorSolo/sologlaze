import type { MetadataRoute } from "next";

const PRIVATE = ["/admin", "/cuenta", "/checkout", "/carrito", "/api"];

// Los buscadores con IA (ChatGPT, Perplexity, Claude, Gemini) leen el sitio con estos rastreadores.
// Se permiten de forma explícita para que el catálogo pueda aparecer en sus respuestas.
const AI_CRAWLERS = [
  "OAI-SearchBot", // búsqueda de ChatGPT
  "ChatGPT-User", // ChatGPT cuando abre una página a pedido del usuario
  "GPTBot", // entrenamiento de OpenAI
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended", // Gemini
  "Applebot-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: PRIVATE },
    ],
    sitemap: "https://sologlazes.com.ar/sitemap.xml",
    host: "https://sologlazes.com.ar",
  };
}
