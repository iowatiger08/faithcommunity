import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  // amazon-cognito-identity-js (the /moderation/ sign-in) pulls in `buffer`,
  // which references the Node global `global`. Without this every page throws
  // "global is not defined" on load and renders blank. The Deutsch app carries
  // the same define. Do not remove it while that library is a dependency.
  define: { global: "globalThis" },
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
    // No source maps in the production bundle. A published .map carries the
    // full original source, comments and all, to anyone who fetches it.
    // `npm run dev` and
    // `vite build --sourcemap` still produce them when actually debugging.
    sourcemap: false,
  },
  // vite-react-ssg picks up routes from src/main.tsx
  ssgOptions: {
    script: "async",
    formatting: "none",
    // Emit nested directories: /sermons/foo/index.html instead of /sermons/foo.html
    // so that /sermons/foo/ serves cleanly without a .html extension on S3.
    dirStyle: "nested",
  },
});
