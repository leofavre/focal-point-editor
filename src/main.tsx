import React from "react";
import ReactDOM from "react-dom/client";
import { initDB } from "react-indexed-db-hook";
import App from "./App";
import { DBConfig } from "./services/database";

const rootElement = document.getElementById("app");

initDB(DBConfig);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
