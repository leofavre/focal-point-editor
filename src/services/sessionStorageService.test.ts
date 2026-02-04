import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSessionStorageService } from "./sessionStorageService";

describe("getSessionStorageService", () => {
  const tableName = "test_table";

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("addRecord and getRecord round-trip a value", async () => {
    const service = getSessionStorageService<{ id: string; name: string }, string>(tableName);
    const record = { id: "r1", name: "First" };

    await service.addRecord(record);
    const got = await service.getRecord("r1");

    expect(got).toEqual(record);
  });

  it("getRecord returns undefined when key is missing", async () => {
    const service = getSessionStorageService<{ id: string }, string>(tableName);

    const got = await service.getRecord("missing");

    expect(got).toBeUndefined();
  });

  it("getAllRecords returns all records for the table", async () => {
    const service = getSessionStorageService<{ id: string; v: number }, string>(tableName);

    await service.addRecord({ id: "a", v: 1 });
    await service.addRecord({ id: "b", v: 2 });

    const all = await service.getAllRecords();

    expect(all).toHaveLength(2);
    expect(all.map((r) => r.id).sort()).toEqual(["a", "b"]);
  });

  it("getAllRecords returns only records for this tableName", async () => {
    const serviceA = getSessionStorageService<{ id: string }, string>("table_a");
    const serviceB = getSessionStorageService<{ id: string }, string>("table_b");

    await serviceA.addRecord({ id: "only-in-a" });
    await serviceB.addRecord({ id: "only-in-b" });

    const fromA = await serviceA.getAllRecords();
    const fromB = await serviceB.getAllRecords();

    expect(fromA).toHaveLength(1);
    expect(fromA[0].id).toBe("only-in-a");
    expect(fromB).toHaveLength(1);
    expect(fromB[0].id).toBe("only-in-b");
  });

  it("updateRecord overwrites existing record", async () => {
    const service = getSessionStorageService<{ id: string; count: number }, string>(tableName);

    await service.addRecord({ id: "r1", count: 1 });
    await service.updateRecord({ id: "r1", count: 2 });

    const got = await service.getRecord("r1");
    expect(got).toEqual({ id: "r1", count: 2 });
  });

  it("deleteRecord removes the record", async () => {
    const service = getSessionStorageService<{ id: string }, string>(tableName);

    await service.addRecord({ id: "r1" });
    await service.deleteRecord("r1");

    const got = await service.getRecord("r1");
    expect(got).toBeUndefined();
  });

  it("addRecord uses value.id when present for storage key", async () => {
    const service = getSessionStorageService<{ id: string }, string>(tableName);

    await service.addRecord({ id: "my-id" });

    expect(await service.getRecord("my-id")).toEqual({ id: "my-id" });
  });

  it("different tableName values do not collide", async () => {
    const service1 = getSessionStorageService<{ id: string }, string>("t1");
    const service2 = getSessionStorageService<{ id: string }, string>("t2");

    await service1.addRecord({ id: "same-key" });
    await service2.addRecord({ id: "same-key" });

    const from1 = await service1.getRecord("same-key");
    const from2 = await service2.getRecord("same-key");

    expect(from1).toEqual({ id: "same-key" });
    expect(from2).toEqual({ id: "same-key" });
    expect(await service1.getAllRecords()).toHaveLength(1);
    expect(await service2.getAllRecords()).toHaveLength(1);
  });

  it("throws when sessionStorage is not available", () => {
    const originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, "sessionStorage", {
      value: undefined,
      configurable: true,
    });

    expect(() => getSessionStorageService(tableName)).toThrow(
      "sessionStorage is not available",
    );

    Object.defineProperty(window, "sessionStorage", {
      value: originalSessionStorage,
      configurable: true,
    });
  });
});
