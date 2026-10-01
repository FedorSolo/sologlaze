import type { Config } from "tailwindcss";

// Tokens realineados al estilo "MAKR" (vitrina editorial monocromática: tinta casi negra
// sobre papel blanco, una sola banda salvia como respiro cromático, cero radios, nav de
// enlaces subrayados en vez de botones rellenos). Como casi todo el sitio ya usa estos
// nombres semánticos (bg-accent, rounded-full, text-text-secondary...), remapear los
// valores aquí empuja el nuevo estilo a todo el sitio sin tocar cada componente a mano.
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "24px", lg: "48px" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        bg: "#FFFFFF", // Paper
        surface: "#FFFFFF", // Paper — las tarjetas comparten fondo con el canvas, sin elevación
        "surface-muted": "#F0F0F0", // Bone — secciones alternadas, paneles sutiles
        border: {
          DEFAULT: "#1C1717", // Obsidian Ink — único separador estructural, 1px siempre
          strong: "#1C1717",
        },
        text: {
          primary: "#1C1717", // Obsidian Ink
          secondary: "#5C5955", // Ink aclarado — mantiene el matiz cálido, no es un gris genérico
          disabled: "#A9AEA9", // Eucalyptus Mist también cubre estados deshabilitados
        },
        accent: {
          DEFAULT: "#1C1717", // No hay color de CTA propio en MAKR: el "acento" es la propia tinta
          hover: "#A9AEA9", // Eucalyptus Mist — el único matiz permitido, reservado para hover
          soft: "#F0F0F0", // Bone — fondo de chip/estado activo, siempre con texto Ink
        },
        // Del logo real ("Solo"): dorado mostaza + contorno negro. MAKR es estrictamente
        // monocromo + salvia, así que este dorado queda fuera de la UI — vive solo en el
        // logo (una imagen fija), no se usa como color de interfaz en ningún componente.
        brand: {
          gold: "#E3B01A",
          "gold-soft": "#FBF0D2",
          ink: "#1C1717",
        },
        // MAKR no define colores de categoría — es un catálogo de un solo tipo de objeto.
        // SoloGlazes sí necesita distinguir 3 líneas de producto de un vistazo, así que se
        // mantiene la función pero muy desaturada, para no romper el lenguaje casi acromático.
        collection: {
          cristalina: "#54656B",
          floating: "#5E6B52",
          grrr: "#1C1717",
        },
        status: {
          success: "#3F7A4E",
          warning: "#8A6A2E",
          error: "#A23B2E",
          info: "#54656B",
        },
      },
      fontFamily: {
        // Sohne es tipografía de pago — Inter es la alternativa que la propia guía MAKR sugiere.
        display: ["var(--font-display)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-display)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Escala MAKR: compacta, sin negrita, con tracking positivo — la jerarquía se lee en
        // tamaño y espaciado entre letras, nunca en peso ni en color.
        display: ["1.5rem", { lineHeight: "1.15", letterSpacing: "0.03em" }],
        "display-lg": ["2rem", { lineHeight: "1.15", letterSpacing: "0.03em" }],
        h1: ["1.25rem", { lineHeight: "1.15", letterSpacing: "0.02em" }],
        "h1-lg": ["1.5rem", { lineHeight: "1.15", letterSpacing: "0.03em" }],
        h2: ["1.125rem", { lineHeight: "1.4", letterSpacing: "0.015em" }],
        "h2-lg": ["1.25rem", { lineHeight: "1.15", letterSpacing: "0.02em" }],
        h3: ["1rem", { lineHeight: "1.4", letterSpacing: "0.015em" }],
        "h3-lg": ["1.125rem", { lineHeight: "1.4", letterSpacing: "0.015em" }],
        caption: ["0.6875rem", { lineHeight: "1.35", letterSpacing: "0.02em" }],
        "body-lg": ["0.875rem", { lineHeight: "1.45", letterSpacing: "0.013em" }],
        small: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.015em" }],
      },
      borderRadius: {
        DEFAULT: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        full: "0px", // MAKR: cero radio en todo — inputs, botones "pill", tarjetas, modales
      },
      boxShadow: {
        sm: "none",
        md: "none",
        lg: "none",
      },
      spacing: {
        18: "72px",
        22: "88px",
      },
    },
  },
  plugins: [],
} satisfies Config;
