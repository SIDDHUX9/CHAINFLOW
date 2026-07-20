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
          goldMuted: "rgba(212, 175, 55, 0.15)",
        },
        space: {
          black: "#0A0A0F",
          dark: "#050508",
          blue: "#1A1A3E",
          purple: "#7B61FF",
          card: "#12121F",
          border: "rgba(212, 175, 55, 0.1)",
        },
        accent: {
          purple: "#7B61FF",
          green: "#00D26A",
          red: "#FF4757",
        },
      },
      fontFamily: {
        sans: ["Barlow", "sans-serif"],
        display: ["Barlow", "sans-serif"],
        heading: ["'Instrument Serif'", "serif"],
        body: ["Barlow", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

