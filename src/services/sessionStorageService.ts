/**
 * SessionStorage-backed DatabaseService. Each method returns a Result.
 * Values are stored as JSON; only JSON-serializable data is supported.
 * For Blob/File data (e.g. images), use an IndexedDB- or in-memory-backed service instead.
 */
import type { Result } from "../helpers/errorHandling";
import { accept, reject } from "../helpers/errorHandling";
import { getRecordKeyFromValue } from "../helpers/recordKey";
import { isSessionStorageAvailable } from "../helpers/sessionStorageAvailability";
import type { DatabaseKey, DatabaseService } from "./types";

const SESSION_PREFIX = "fpe_session_";
const UNAVAILABLE = "SessionStorageUnavailable" as const;

function keyFor(tableName: string, recordKey: string | number): string {
  return `${SESSION_PREFIX}${tableName}_${String(recordKey)}`;
}

function createUnavailableStub<T, K extends DatabaseKey>(): DatabaseService<
  T,
  K,
  typeof UNAVAILABLE
> {
  const rejected = reject({ reason: UNAVAILABLE });
  return {
    addRecord: async () => rejected,
    getRecord: async () => rejected,
    getAllRecords: async () => rejected,
    updateRecord: async () => rejected,
    upsertRecord: async () => rejected,
    deleteRecord: async () => rejected,
  };
}

/**
 * Returns a DatabaseService backed by sessionStorage.
 * Each method returns Result<..., "SessionStorageUnavailable">.
 * When sessionStorage is unavailable, the returned service's methods all return rejected.
 */
export function getSessionStorageService<T, K extends DatabaseKey = string>(
  tableName: string,
): DatabaseService<T, K, typeof UNAVAILABLE> {
  if (!isSessionStorageAvailable()) {
    return createUnavailableStub<T, K>();
  }

  const storage = window.sessionStorage;
  const prefix = `${SESSION_PREFIX}${tableName}_`;

  return {
    async addRecord(value: T, key?: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        const recordKey = getRecordKeyFromValue(value, key);
        storage.setItem(keyFor(tableName, recordKey), JSON.stringify(value));
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async getRecord(id: number | string): Promise<Result<T | undefined, typeof UNAVAILABLE>> {
      try {
        const raw = storage.getItem(keyFor(tableName, String(id)));
        if (raw === null) return accept(undefined);
        return accept(JSON.parse(raw) as T);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async getAllRecords(): Promise<Result<T[], typeof UNAVAILABLE>> {
      try {
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
        return accept(result);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async updateRecord(value: T, key?: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        const recordKey = getRecordKeyFromValue(value, key);
        storage.setItem(keyFor(tableName, recordKey), JSON.stringify(value));
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async upsertRecord(value: T, key?: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        const recordKey = getRecordKeyFromValue(value, key);
        storage.setItem(keyFor(tableName, recordKey), JSON.stringify(value));
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async deleteRecord(key: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        storage.removeItem(keyFor(tableName, String(key)));
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },
  };
}
