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
    // No source maps in the production bundle. A published .map carries the
    // full original source, comments and all, to anyone who fetches it — which
    // for this site meant the admin auth module, its allow-listed identity and
    // the names of the other sites that share the account. `npm run dev` and
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
