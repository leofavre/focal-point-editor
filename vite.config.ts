import react from "@vitejs/plugin-react";
import { Mode, plugin as mdPlugin } from "vite-plugin-markdown";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

/** @see https://vite.dev/config/ */
export default defineConfig({
  plugins: [
    mdPlugin({ mode: [Mode.REACT] }),
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
  },
});
