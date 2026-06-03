import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    sourcemap: true,
  },
  // vite-react-ssg picks up routes from src/main.tsx
  ssgOptions: {
    script: "async",
    formatting: "none",
  },
});
