import React from "react";
import ReactDOM from "react-dom/client";
import { initDB } from "react-indexed-db-hook";
import Generator from "./pages/Generator/Generator";

const rootElement = document.getElementById("app");

const DBConfig = {
  name: "FocusPointDB",
  version: 2,
  objectStoresMeta: [
    {
      store: "ui",
      storeConfig: {
        keyPath: "id",
        autoIncrement: true,
      },
      storeSchema: [
        {
          name: "value",
          keypath: "value",
          options: { unique: false },
        },
      ],
    },
    {
      store: "images",
      storeConfig: {
        keyPath: "id",
        autoIncrement: false,
      },
      storeSchema: [
        {
          name: "createdAt",
          keypath: "createdAt",
          options: { unique: false },
        },
      ],
    },
  ],
};

initDB(DBConfig);

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Generator />
    </React.StrictMode>,
  );
}
