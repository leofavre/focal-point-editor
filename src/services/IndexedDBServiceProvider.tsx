import type { PropsWithChildren } from "react";
import type { IndexedDBProps } from "react-indexed-db-hook";
import type { ImageRecord } from "../types";
import { DBConfig } from "./databaseConfig";
import { getIndexedDBService } from "./indexedDBService";
import { IndexedDBServiceContext } from "./indexedDBServiceContext";

export function IndexedDBServiceProvider({ children }: PropsWithChildren) {
  const service = getIndexedDBService<ImageRecord>(DBConfig as IndexedDBProps, "images");
  return (
    <IndexedDBServiceContext.Provider value={service}>{children}</IndexedDBServiceContext.Provider>
  );
}
