import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1D9E75",
          dark: "#0F6E56",
          light: "#E1F5EE",
        },
        ink: {
          DEFAULT: "#0F172A",
          soft: "#475569",
          faint: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
