/**
 * IndexedDB-backed DatabaseService. Each method returns a Result.
 * Must be called from a React component (uses useIndexedDB hook).
 */
import { type IndexedDBProps, initDB, useIndexedDB } from "react-indexed-db-hook";
import type { Result } from "../helpers/errorHandling";
import { accept, reject } from "../helpers/errorHandling";
import { isIndexedDBAvailable } from "../helpers/indexedDBAvailability";
import { getRecordKeyFromValue } from "../helpers/recordKey";
import type { DatabaseKey, DatabaseService } from "./types";

const UNAVAILABLE = "IndexedDBUnavailable" as const;

const initializedDatabases = new Set<string>();

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
 * Returns a DatabaseService backed by IndexedDB.
 * Each method returns Result<..., "IndexedDBUnavailable">.
 * When IndexedDB is unavailable, the returned service's methods all return rejected.
 * Must be called from a React component (uses useIndexedDB hook).
 */
export function getIndexedDBService<T, K extends DatabaseKey = string>(
  dbConfig: IndexedDBProps,
  tableName: string,
): DatabaseService<T, K, typeof UNAVAILABLE> {
  if (!isIndexedDBAvailable()) {
    return createUnavailableStub<T, K>();
  }

  const dbKey = `${dbConfig.name}_${dbConfig.version}`;

  if (!initializedDatabases.has(dbKey)) {
    initDB(dbConfig);
    initializedDatabases.add(dbKey);
  }

  /* biome-ignore lint/correctness/useHookAtTopLevel: Needed for when IndexedDB is unavailable */
  const indexedDB = useIndexedDB(tableName);

  return {
    async addRecord(value: T, key?: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        await indexedDB.add(value, key);
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async getRecord(id: number | string): Promise<Result<T | undefined, typeof UNAVAILABLE>> {
      try {
        const value = await indexedDB.getByID(id);
        return accept(value);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async getAllRecords(): Promise<Result<T[], typeof UNAVAILABLE>> {
      try {
        const items = await indexedDB.getAll();
        return accept(items);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async updateRecord(value: T, key?: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        await indexedDB.update(value, key);
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async upsertRecord(value: T, key?: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        const id = getRecordKeyFromValue(value, key);
        const existing = await indexedDB.getByID(id);
        if (existing === undefined || existing === null) {
          await indexedDB.add(value, key);
        } else {
          await indexedDB.update(value, key);
        }
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },

    async deleteRecord(key: K): Promise<Result<void, typeof UNAVAILABLE>> {
      try {
        await indexedDB.deleteRecord(key);
        return accept(undefined);
      } catch (error) {
        return reject({ reason: UNAVAILABLE, error });
      }
    },
  };
}
