import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F3E5AB",
          dark: "#AA7C11",
          goldMuted: "rgba(212, 175, 55, 0.12)",
        },
        space: {
          black: "#050508",
          dark: "#08090E",
          blue: "#0F172A",
          purple: "#1E293B",
          card: "#0E1017",
          border: "rgba(255, 255, 255, 0.08)",
        },
        accent: {
          purple: "#6366F1",
          green: "#10B981",
          red: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        display: ["'Inter'", "-apple-system", "sans-serif"],
        heading: ["'Inter'", "-apple-system", "sans-serif"],
        body: ["'Inter'", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

