import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "surface-main": "#1E1E1E",
        "surface-card": "#252525",
        "surface-container": "#1c211b",
        "surface-container-low": "#181d17",
        "surface-container-lowest": "#0b0f0a",
        "surface-container-high": "#262b25",
        "surface-container-highest": "#31362f",
        "surface-bright": "#363b34",
        "border-subtle": "#333333",
        "text-primary": "#FFFFFF",
        "text-secondary": "#B0B0B0",
        "status-error": "#D32F2F",
        "status-warning": "#ED6C02",
        primary: "#88d982",
        "primary-fixed-dim": "#88d982",
        "primary-container": "#2e7d32",
        "on-primary": "#003909",
        "process-1": "#2196F3",
        "process-2": "#4CAF50",
        "process-3": "#9C27B0",
        "process-4": "#FF9800",
        "process-5": "#F44336",
        "process-6": "#00BCD4",
        "process-7": "#E91E63",
        "process-8": "#8BC34A",
      },
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      spacing: {
        "card-gap": "16px",
        gutter: "20px",
        "container-padding": "24px",
      },
    },
  },
  plugins: [],
};

export default config;
