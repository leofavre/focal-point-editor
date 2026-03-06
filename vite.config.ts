import path from "node:path";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

/** @see https://vite.dev/config/ */
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  esbuild: {
    pure: mode === "production" ? ["console.log"] : [],
  },
  server: {
    port: 5173,
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
    vike(),
  ],
  test: {
    environment: "jsdom",
    mockReset: true,
    setupFiles: ["./vitest.setup.ts"],
    // Prevents running e2e tests like they were unit tests.
    exclude: ["**/node_modules/**", "**/dist/**", "e2e/**"],
  },
}));
