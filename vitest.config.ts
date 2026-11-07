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
      // main.tsx only wires routes for the SSG build; src/test/ holds test helpers.
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test-setup.ts",
        "src/vite-env.d.ts",
        "src/main.tsx",
        "src/test/**",
      ],
      reporter: ["text-summary", "text", "html"],
      reportsDirectory: "coverage/js",
      // Floor, not target: set just under current coverage. Raise as tests land.
      thresholds: { lines: 99, statements: 99, functions: 100, branches: 97 },
    },
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
});
