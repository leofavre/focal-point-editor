/**
 * Clears all object stores in an IndexedDB database.
 * For use in tests that rely on the fake IndexedDB (vitest.setup.ts).
 * If the DB doesn't exist yet, this is a no-op.
 */
export function clearIndexedDBStores(dbName: string, dbVersion: number): Promise<void> {
  return new Promise((resolve) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onsuccess = () => {
      const db = request.result;
      const storeNames = Array.from(db.objectStoreNames);
      if (storeNames.length === 0) {
        db.close();
        resolve();
        return;
      }

      const transaction = db.transaction(storeNames, "readwrite");

      transaction.oncomplete = () => {
        db.close();
        resolve();
      };

      transaction.onerror = () => {
        db.close();
        resolve();
      };

      for (const storeName of storeNames) {
        transaction.objectStore(storeName).clear();
      }
    };

    request.onerror = () => {
      resolve();
    };

    request.onupgradeneeded = () => {
      request.transaction?.abort();
      resolve();
    };
  });
}
