/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          900: "#134e4a",
          950: "#042f2e",
        },
        field: {
          dark: "#0b0f17",
          panel: "#121824",
          border: "#1f293d",
          muted: "#94a3b8",
          accent: "#38bdf8",
        },
        severity: {
          critical: "#ef4444",
          high: "#f97316",
          moderate: "#eab308",
          low: "#0ea5e9",
          informational: "#64748b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
