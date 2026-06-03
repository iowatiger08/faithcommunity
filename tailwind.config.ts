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
        paper: "#fbfaf6",
        accent: "#7a3e3e",
      },
      maxWidth: {
        prose: "65ch",
      },
    },
  },
  plugins: [],
} satisfies Config;
