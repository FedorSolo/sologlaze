import type { Config } from "tailwindcss";

// Tokens sourced from 03-DesignSystem.md — do not hardcode raw hex elsewhere in the app.
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
        bg: "#FAF8F5",
        surface: "#FFFFFF",
        "surface-muted": "#F2EEE8",
        border: {
          DEFAULT: "#E4DED4",
          strong: "#CBC2B3",
        },
        text: {
          primary: "#231F1B",
          secondary: "#6B6153",
          disabled: "#B4AA9B",
        },
        accent: {
          DEFAULT: "#B5502B",
          hover: "#9A4223",
          soft: "#F3E4DB",
        },
        // Del logo real ("Solo"): dorado mostaza + contorno negro grueso.
        // Se usa en el logotype, badges destacados y micro-momentos (no como accent global de UI).
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
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["2.25rem", { lineHeight: "1.05" }],
        "display-lg": ["4rem", { lineHeight: "1.05" }],
        h1: ["1.875rem", { lineHeight: "1.1" }],
        "h1-lg": ["3rem", { lineHeight: "1.1" }],
        h2: ["1.5rem", { lineHeight: "1.15" }],
        "h2-lg": ["2.25rem", { lineHeight: "1.15" }],
        h3: ["1.25rem", { lineHeight: "1.2" }],
        "h3-lg": ["1.5rem", { lineHeight: "1.2" }],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "24px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(35,31,27,0.06)",
        md: "0 8px 24px rgba(35,31,27,0.08)",
        lg: "0 24px 48px rgba(35,31,27,0.12)",
      },
      spacing: {
        18: "72px",
        22: "88px",
      },
    },
  },
  plugins: [],
} satisfies Config;
