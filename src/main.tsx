/**
 * Legacy entry. The app is driven by Vike when using `npm run dev` / `vike build`.
 * This file is kept for compatibility (e.g. tooling that expects a main entry).
 */

import { registerSW } from "virtual:pwa-register";
import React from "react";
import ReactDOM from "react-dom/client";

if (typeof document !== "undefined") {
  const rootElement = document.getElementById("app");
  registerSW({ immediate: true });

  if (rootElement) {
    rootElement.innerHTML = "";
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <p>Run the app with npm run dev (Vike).</p>
      </React.StrictMode>,
    );
  }
}
