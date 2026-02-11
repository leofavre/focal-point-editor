/**
 * SessionStorage-backed DatabaseService. Values are stored as JSON; only
 * JSON-serializable data is supported. For stores that contain Blob/File
 * (e.g. "images"), use getIndexedDBService instead.
 */
import type { Result } from "../helpers/errorHandling";
import { accept, reject } from "../helpers/errorHandling";
import { isSessionStorageAvailable } from "../helpers/sessionStorageAvailability";
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

/**
 * Returns sessionStorage as a Result. Use this for Result-based handling.
 */
export function getStorageResult(): Result<Storage, "SessionStorageUnavailable"> {
  if (!isSessionStorageAvailable()) {
    return reject({ reason: "SessionStorageUnavailable" });
  }
  return accept(window.sessionStorage);
}

/**
 * Implements a DatabaseService backed by sessionStorage.
 * Returns a Result so callers can handle SessionStorageUnavailable without try/catch.
 * Suitable for JSON-serializable stores only (e.g. "ui"). Stores that contain
 * Blob/File (e.g. "images") should use getIndexedDBService instead.
 */
export function getSessionStorageService<T, K extends DatabaseKey = string>(
  tableName: string,
): Result<DatabaseService<T, K>, "SessionStorageUnavailable"> {
  const storageResult = getStorageResult();

  if (storageResult.rejected != null) {
    /**
     * @todo Maybe show error to the user in the UI.
     */
    return reject(storageResult.rejected);
  }

  const storage = storageResult.accepted;
  const prefix = `${SESSION_PREFIX}${tableName}_`;

  return accept({
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
  } satisfies DatabaseService<T, K>);
}
