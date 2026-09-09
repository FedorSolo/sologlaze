import type { Config } from "tailwindcss";

// Tokens realineados al estilo "Palmer" (galería de cerámica, canvas crema,
// bordes hairline, sin sombras, tipografía condensada). El color ahora lo
// aportan solo el logo y las fotos de producto — la UI queda casi grayscale.
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
        bg: "#F5F6EE", // Gallery Cream
        surface: "#F5F6EE", // las tarjetas usan el mismo fondo que el canvas — la profundidad viene del borde
        "surface-muted": "#ECEDE2", // variante sutil para hover/bloques secundarios
        border: {
          DEFAULT: "#222222", // Ink — el único separador estructural del sistema
          strong: "#000000", // Lampblack — foco de inputs
        },
        text: {
          primary: "#222222", // Ink
          secondary: "#A1A19C", // Fog
          disabled: "#C7C7C0",
        },
        accent: {
          DEFAULT: "#222222", // Ink — sin color de marca en la UI, solo tinta oscura
          hover: "#000000", // Lampblack
          soft: "#ECEDE2", // fondo claro para chips/badges activos, siempre con texto Ink (contraste seguro)
        },
        // Del logo real ("Solo"): dorado mostaza + contorno negro grueso.
        // Es la única fuente de color deliberada en la UI, además de las fotos de producto.
        brand: {
          gold: "#E3B01A",
          "gold-soft": "#FBF0D2",
          ink: "#1A1714",
        },
        collection: {
          cristalina: "#3E7C8A",
          floating: "#7A8B4A",
          grrr: "#1A1714",
        },
        status: {
          success: "#3F7A4E",
          warning: "#B8862E",
          error: "#B23B2E",
          info: "#3E6B8A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["4.5rem", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        h1: ["1.875rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "h1-lg": ["3rem", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
        h2: ["1.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "h2-lg": ["2.25rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h3: ["1.125rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "h3-lg": ["1.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        caption: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
        "body-lg": ["1.125rem", { lineHeight: "1.4", letterSpacing: "-0.03em" }],
        small: ["0.75rem", { lineHeight: "1.4", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        sm: "3px",
        md: "9px",
        lg: "9px",
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
