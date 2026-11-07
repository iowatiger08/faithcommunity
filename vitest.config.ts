import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "lambda/**/*.test.mjs"],
    environmentMatchGlobs: [
      ["lambda/**", "node"],
      ["src/**", "jsdom"],
    ],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}", "lambda/*/index.mjs"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test-setup.ts", "src/vite-env.d.ts"],
      reporter: ["text-summary", "text", "html"],
      reportsDirectory: "coverage/js",
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
