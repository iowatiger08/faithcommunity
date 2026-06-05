import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#1a1a1a",
        // paper (page background) + accent shift with the liturgical season —
        // see the [data-season] palettes in styles.css. Defined as space-separated
        // RGB channels so Tailwind's /alpha modifiers (bg-accent/90 etc.) work.
        paper: "rgb(var(--paper-rgb) / <alpha-value>)",
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
} satisfies Config;
