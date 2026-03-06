import { createContext, useContext } from "react";
import type { ImageRecord } from "../types";
import type { DatabaseService } from "./types";

const UNAVAILABLE = "IndexedDBUnavailable" as const;

export type IndexedDBServiceValue = DatabaseService<ImageRecord, string, typeof UNAVAILABLE> | null;

export const IndexedDBServiceContext = createContext<IndexedDBServiceValue>(null);

export function useIndexedDBService(): IndexedDBServiceValue {
  return useContext(IndexedDBServiceContext);
}
