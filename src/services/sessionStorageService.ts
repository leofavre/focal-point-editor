/**
 * SessionStorage-backed DatabaseService. Values are stored as JSON; only
 * JSON-serializable data is supported. For stores that contain Blob/File
 * (e.g. "images"), use getIndexedDBService instead.
 */
import type { DatabaseKey, DatabaseService } from "./types";

const SESSION_PREFIX = "fpe_session_";

function keyFor(tableName: string, recordKey: string | number): string {
  return `${SESSION_PREFIX}${tableName}_${String(recordKey)}`;
}

function hasId(obj: unknown): obj is { id: unknown } {
  return typeof obj === "object" && obj != null && "id" in obj;
}

function getRecordKeyFromValue<T>(value: T, key?: DatabaseKey): string {
  const id = hasId(value) ? value.id : key;
  return String(id);
}

function getStorage(): Storage {
  if (typeof window === "undefined" || !window.sessionStorage) {
    throw new Error("sessionStorage is not available");
  }
  return window.sessionStorage;
}

/**
 * Implements a DatabaseService backed by sessionStorage.
 * Suitable for JSON-serializable stores only (e.g. "ui"). Stores that contain
 * Blob/File (e.g. "images") should use getIndexedDBService instead.
 */
export function getSessionStorageService<T, K extends DatabaseKey = string>(
  tableName: string,
): DatabaseService<T, K> {
  const storage = getStorage();
  const prefix = `${SESSION_PREFIX}${tableName}_`;

  return {
    async addRecord(value: T, key?: K): Promise<void> {
      const recordKey = getRecordKeyFromValue(value, key);
      storage.setItem(keyFor(tableName, recordKey), JSON.stringify(value));
    },

    async getRecord(id: number | string): Promise<T | undefined> {
      const raw = storage.getItem(keyFor(tableName, String(id)));
      if (raw === null) return undefined;
      return JSON.parse(raw) as T;
    },

    async getAllRecords(): Promise<T[]> {
      const result: T[] = [];
      for (let i = 0; i < storage.length; i++) {
        const k = storage.key(i);
        if (k?.startsWith(prefix)) {
          const raw = storage.getItem(k);
          if (raw !== null) {
            result.push(JSON.parse(raw) as T);
          }
        }
      }
      return result;
    },

    async updateRecord(value: T, key?: K): Promise<void> {
      const recordKey = getRecordKeyFromValue(value, key);
      storage.setItem(keyFor(tableName, recordKey), JSON.stringify(value));
    },

    async deleteRecord(key: K): Promise<void> {
      storage.removeItem(keyFor(tableName, String(key)));
    },
  } satisfies DatabaseService<T, K>;
}
