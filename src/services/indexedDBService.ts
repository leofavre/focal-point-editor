import { initDB, useIndexedDB } from "react-indexed-db-hook";
import { DBConfig } from "./databaseConfig";
import type { DatabaseKey, DatabaseService } from "./types";

let databaseInitialized = false;

export function getIndexedDBService<T, K extends DatabaseKey = string>(
  tableName: string,
): DatabaseService<T, K> {
  if (databaseInitialized === false) {
    initDB(DBConfig);
    databaseInitialized = true;
  }

  const indexedDB = useIndexedDB(tableName);

  return {
    async addRecord(value: T, key?: K) {
      await indexedDB.add(value, key);
    },
    getRecord: indexedDB.getByID,
    getAllRecords: indexedDB.getAll,
    updateRecord: indexedDB.update,
    async deleteRecord(key: K) {
      await indexedDB.deleteRecord(key);
    },
  };
}
