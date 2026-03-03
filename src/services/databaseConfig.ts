import type { IndexedDBProps } from "react-indexed-db-hook";

export const DBConfig: IndexedDBProps = {
  name: "FocalPointEditor",
  version: 1,
  objectStoresMeta: [
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
