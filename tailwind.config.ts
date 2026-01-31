import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#3b82f6",
        accent: "#06b6d4",
        background: "#0b0f1a",
        surface: "#111827",
      },
      boxShadow: {
        glow: "0 0 30px rgba(99, 102, 241, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
