import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Result } from "../helpers/errorHandling";
import { getInMemoryStorageServiceResultBased } from "./inMemoryStorageServiceResultBased";
import { getIndexedDBServiceResultBased } from "./indexedDBServiceResultBased";
import { getSessionStorageServiceResultBased } from "./sessionStorageServiceResultBased";
import type { ResultBasedDatabaseService } from "./types";

const tableStores = new Map<string, Map<string, unknown>>();

function getStoreForTable(tableName: string): Map<string, unknown> {
  if (!tableStores.has(tableName)) {
    tableStores.set(tableName, new Map());
  }
  return tableStores.get(tableName)!;
}

function getRecordKey(value: unknown, key?: unknown): string {
  const obj = value as { id?: unknown };
  return String(obj?.id ?? key ?? "");
}

vi.mock("../helpers/indexedDBAvailability", () => ({
  isIndexedDBAvailable: vi.fn(() => true),
}));

vi.mock("react-indexed-db-hook", () => ({
  initDB: vi.fn(),
  useIndexedDB: vi.fn((tableName: string) => {
    const store = getStoreForTable(tableName);
    return {
      add: async (value: unknown, key?: unknown) => {
        store.set(getRecordKey(value, key), value);
      },
      getByID: async (id: string | number) => store.get(String(id)),
      getAll: async () => Array.from(store.values()),
      update: async (value: unknown, key?: unknown) => {
        store.set(getRecordKey(value, key), value);
      },
      deleteRecord: async (key: string) => {
        store.delete(String(key));
      },
    };
  }),
}));

async function expectAccepted<T, R extends string>(
  promise: Promise<Result<T, R>>,
): Promise<T> {
  const result = await promise;
  if (result.rejected != null) {
    throw new Error(`Expected accepted result but got rejected: ${result.rejected.reason}`);
  }
  return result.accepted as T;
}

let tableCounter = 0;

function getUniqueTableName(): string {
  tableCounter += 1;
  return `test_table_${tableCounter}`;
}

type ServiceConfig = {
  name: string;
  getService: <T, K extends string = string>(
    tableName: string,
  ) => ResultBasedDatabaseService<T, K, string>;
};

const serviceConfigs: ServiceConfig[] = [
  {
    name: "sessionStorage",
    getService: (tableName) => getSessionStorageServiceResultBased(tableName),
  },
  {
    name: "inMemory",
    getService: (tableName) => getInMemoryStorageServiceResultBased(tableName),
  },
  {
    name: "indexedDB",
    getService: <T, K extends string = string>(tableName: string) => {
      const { result } = renderHook(() => getIndexedDBServiceResultBased<T, K>(tableName));
      return result.current as ResultBasedDatabaseService<T, K, string>;
    },
  },
];

describe("result-based services (shared contract)", () => {
  it.each(serviceConfigs)(
    "addRecord and getRecord round-trip a value ($name)",
    async ({ getService }) => {
      const tableName = getUniqueTableName();
      const service = getService<{ id: string; name: string }, string>(tableName);
      const record = { id: "r1", name: "First" };

      await expectAccepted(service.addRecord(record));
      const got = await expectAccepted(service.getRecord("r1"));

      expect(got).toEqual(record);
    },
  );

  it.each(serviceConfigs)(
    "getRecord returns undefined when key is missing ($name)",
    async ({ getService }) => {
      const tableName = getUniqueTableName();
      const service = getService<{ id: string }, string>(tableName);

      const got = await expectAccepted(service.getRecord("missing"));

      expect(got).toBeUndefined();
    },
  );

  it.each(serviceConfigs)(
    "getAllRecords returns all records for the table ($name)",
    async ({ getService }) => {
      const tableName = getUniqueTableName();
      const service = getService<{ id: string; v: number }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "a", v: 1 }));
      await expectAccepted(service.addRecord({ id: "b", v: 2 }));

      const all = await expectAccepted(service.getAllRecords());

      expect(all).toHaveLength(2);
      expect(all!.map((r) => r.id).sort()).toEqual(["a", "b"]);
    },
  );

  it.each(serviceConfigs)(
    "updateRecord overwrites existing record ($name)",
    async ({ getService }) => {
      const tableName = getUniqueTableName();
      const service = getService<{ id: string; count: number }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "r1", count: 1 }));
      await expectAccepted(service.updateRecord({ id: "r1", count: 2 }));

      const got = await expectAccepted(service.getRecord("r1"));
      expect(got).toEqual({ id: "r1", count: 2 });
    },
  );

  it.each(serviceConfigs)(
    "upsertRecord creates record when it does not exist ($name)",
    async ({ getService }) => {
      const tableName = getUniqueTableName();
      const service = getService<{ id: string; name: string }, string>(tableName);

      await expectAccepted(service.upsertRecord({ id: "new", name: "Created" }));

      const got = await expectAccepted(service.getRecord("new"));
      expect(got).toEqual({ id: "new", name: "Created" });
    },
  );

  it.each(serviceConfigs)(
    "upsertRecord updates record when it exists ($name)",
    async ({ getService }) => {
      const tableName = getUniqueTableName();
      const service = getService<{ id: string; count: number }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "r1", count: 1 }));
      await expectAccepted(service.upsertRecord({ id: "r1", count: 99 }));

      const got = await expectAccepted(service.getRecord("r1"));
      expect(got).toEqual({ id: "r1", count: 99 });
    },
  );

  it.each(serviceConfigs)(
    "deleteRecord removes the record ($name)",
    async ({ getService }) => {
      const tableName = getUniqueTableName();
      const service = getService<{ id: string }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "r1" }));
      await expectAccepted(service.deleteRecord("r1"));

      const got = await expectAccepted(service.getRecord("r1"));
      expect(got).toBeUndefined();
    },
  );

  it.each(serviceConfigs)(
    "addRecord uses value.id when present for storage key ($name)",
    async ({ getService }) => {
      const tableName = getUniqueTableName();
      const service = getService<{ id: string }, string>(tableName);

      await expectAccepted(service.addRecord({ id: "my-id" }));

      const got = await expectAccepted(service.getRecord("my-id"));
      expect(got).toEqual({ id: "my-id" });
    },
  );

  it.each(serviceConfigs)(
    "different table names do not collide ($name)",
    async ({ getService }) => {
      const tableA = getUniqueTableName();
      const tableB = getUniqueTableName();
      const serviceA = getService<{ id: string }, string>(tableA);
      const serviceB = getService<{ id: string }, string>(tableB);

      await expectAccepted(serviceA.addRecord({ id: "only-in-a" }));
      await expectAccepted(serviceB.addRecord({ id: "only-in-b" }));

      const fromA = await expectAccepted(serviceA.getAllRecords());
      const fromB = await expectAccepted(serviceB.getAllRecords());

      expect(fromA).toHaveLength(1);
      expect(fromA![0].id).toBe("only-in-a");
      expect(fromB).toHaveLength(1);
      expect(fromB![0].id).toBe("only-in-b");
    },
  );
});
