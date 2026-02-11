/**
 * IndexedDB-backed ResultBasedDatabaseService. Each method returns a Result
 * instead of the whole service being wrapped in a Result.
 * Must be called from a React component (uses useIndexedDB hook).
 */
import { initDB, useIndexedDB } from "react-indexed-db-hook";
import { isIndexedDBAvailable } from "../helpers/indexedDBAvailability";
import type { Result } from "../helpers/errorHandling";
import { accept, reject } from "../helpers/errorHandling";
import { DBConfig } from "./databaseConfig";
import type { DatabaseKey, ResultBasedDatabaseService } from "./types";

const UNAVAILABLE = "IndexedDBUnavailable" as const;

let databaseInitialized = false;

function createUnavailableStub<T, K extends DatabaseKey>(): ResultBasedDatabaseService<
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
    deleteRecord: async () => rejected,
  };
}

/**
 * Returns a ResultBasedDatabaseService backed by IndexedDB.
 * Each method returns Result<..., "IndexedDBUnavailable">.
 * When IndexedDB is unavailable, the returned service's methods all return rejected.
 * Must be called from a React component (uses useIndexedDB hook).
 */
export function getIndexedDBServiceResultBased<T, K extends DatabaseKey = string>(
  tableName: string,
): ResultBasedDatabaseService<T, K, typeof UNAVAILABLE> {
  if (!isIndexedDBAvailable()) {
    return createUnavailableStub<T, K>();
  }

  if (databaseInitialized === false) {
    initDB(DBConfig);
    databaseInitialized = true;
  }

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
