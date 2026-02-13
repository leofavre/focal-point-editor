/**
 * DatabaseService backed by a module-level in-memory storage (plain JavaScript).
 * Each method returns a Result. All callers share the same storage. Callers use the returned
 * Results to trigger re-renders as needed.
 */
import type { Result } from "../helpers/errorHandling";
import { accept, reject } from "../helpers/errorHandling";
import { getRecordKeyFromValue } from "../helpers/recordKey";
import type { DatabaseKey, DatabaseService } from "./types";

const UNAVAILABLE = "StateUpdateFailed" as const;

const storage = new Map<string, unknown>();

/**
 * Clears all entries for a table name. Only for use in tests (e.g. to avoid leakage between tests).
 */
export function __clearTableForTesting(tableName: string): void {
  const prefix = `${tableName}_`;
  for (const key of Array.from(storage.keys())) {
    if (key.startsWith(prefix)) storage.delete(key);
  }
}

/**
 * Returns a DatabaseService backed by a shared in-memory storage.
 * Each method returns Result<..., "StateUpdateFailed">.
 * tableName namespaces the storage so multiple tables can coexist.
 */
export function getInMemoryStorageService<T, K extends DatabaseKey = string>(
  tableName: string,
): DatabaseService<T, K, typeof UNAVAILABLE> {
  const prefix = `${tableName}_`;

  const keyFor = (recordKey: string | number) => `${prefix}${String(recordKey)}`;

  return {
    async addRecord(value: T, key?: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        const recordKey = getRecordKeyFromValue(value, key);
        storage.set(keyFor(recordKey), value);
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async getRecord(id: number | string): Promise<Result<T | undefined, typeof UNAVAILABLE>> {
      try {
        const value = storage.get(keyFor(id));
        return accept(value as T | undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async getAllRecords(): Promise<Result<T[], typeof UNAVAILABLE>> {
      try {
        const items: T[] = [];
        for (const [k, v] of storage) {
          if (k.startsWith(prefix)) items.push(v as T);
        }
        return accept(items);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async updateRecord(value: T, key?: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        const recordKey = getRecordKeyFromValue(value, key);
        storage.set(keyFor(recordKey), value);
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async upsertRecord(value: T, key?: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        const recordKey = getRecordKeyFromValue(value, key);
        storage.set(keyFor(recordKey), value);
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async deleteRecord(key: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        storage.delete(keyFor(key));
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },
  };
}
