import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

/** @see https://vite.dev/config/ */
export default defineConfig(({ mode }) => ({
  esbuild: {
    pure: mode === "production" ? ["console.log"] : [],
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false,
    }),
  ],
  test: {
    environment: "jsdom",
    mockReset: true,
    setupFiles: ["./vitest.setup.ts"],
    // Prevents running e2e tests like they were unit tests.
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**"],
  },
}));
