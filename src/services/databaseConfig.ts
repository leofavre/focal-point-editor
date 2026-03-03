export const DBConfig = {
  name: "FocalPointEditor",
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
