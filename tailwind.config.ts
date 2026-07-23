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
          DEFAULT: "#C5A059",
          light: "#E8DCC4",
          dark: "#8E6F34",
          goldMuted: "rgba(197, 160, 89, 0.12)",
        },
        space: {
          black: "#0B0C0E",
          dark: "#070708",
          blue: "#141A22",
          purple: "#2E4F6C",
          card: "#141517",
          border: "rgba(197, 160, 89, 0.08)",
        },
        accent: {
          purple: "#2E4F6C",
          green: "#5B7B61",
          red: "#C94A29",
        },
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "Barlow", "sans-serif"],
        display: ["'Shippori Mincho'", "'Noto Sans JP'", "serif"],
        heading: ["'Shippori Mincho'", "serif"],
        body: ["'Noto Sans JP'", "Barlow", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

