import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMockImageRecord, createMockImageState } from "../../../test-utils/mocks";
import type { ImageRecord } from "../../../types";
import { usePersistedImages } from "./usePersistedImages";

const mockAdd = vi.fn();
const mockGetByID = vi.fn();
const mockGetAll = vi.fn();
const mockUpdate = vi.fn();
const mockDeleteRecord = vi.fn();
const mockRandomUUID = vi.fn();

vi.mock("react-indexed-db-hook", () => ({
  useIndexedDB: vi.fn(() => ({
    add: mockAdd,
    getByID: mockGetByID,
    getAll: mockGetAll,
    update: mockUpdate,
    deleteRecord: mockDeleteRecord,
  })),
}));

describe("usePersistedImages", () => {
  const testFile = new Blob(["test"], { type: "image/png" });

  beforeEach(() => {
    vi.stubGlobal("crypto", {
      randomUUID: mockRandomUUID,
    });

    mockRandomUUID.mockReturnValue("test-uuid-123");
    mockGetAll.mockResolvedValue([]);
    mockAdd.mockResolvedValue(undefined);
    mockGetByID.mockResolvedValue(undefined);
    mockUpdate.mockResolvedValue(undefined);
    mockDeleteRecord.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("returns images undefined initially, then loaded list after getAll resolves", async () => {
    const persisted: ImageRecord[] = [];
    mockGetAll.mockResolvedValue(persisted);

    const { result } = renderHook(() => usePersistedImages());

    expect(result.current.images).toBeUndefined();

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    expect(mockGetAll).toHaveBeenCalled();
  });

  it("returns persisted images when getAll resolves with data", async () => {
    const record = createMockImageRecord({
      id: "saved-id",
      ...createMockImageState({ name: "saved.png" }),
      file: testFile,
    });

    mockGetAll.mockResolvedValue([record]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
      expect(result.current.images?.[0]).toMatchObject({
        id: "saved-id",
        name: "saved.png",
      });
    });
  });

  it("addImage generates id, adds record, refreshes, and returns id", async () => {
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const imageState = createMockImageState({ name: "new.png" });

    let returnedId: string | undefined;
    await act(async () => {
      returnedId = await result.current.addImage(imageState, testFile);
    });

    expect(mockRandomUUID).toHaveBeenCalled();
    expect(returnedId).toBe("test-uuid-123");
    expect(mockAdd).toHaveBeenCalledWith({
      id: "test-uuid-123",
      ...imageState,
      file: testFile,
    });
    expect(mockGetAll).toHaveBeenCalledTimes(2); // initial load + refresh after add
  });

  it("getImage returns record when getByID resolves", async () => {
    const record = createMockImageRecord({
      id: "lookup-id",
      ...createMockImageState({ name: "lookup.png" }),
      file: testFile,
    });

    mockGetByID.mockResolvedValue(record);
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let fetched: ImageRecord | undefined;
    await act(async () => {
      fetched = await result.current.getImage("lookup-id");
    });

    expect(mockGetByID).toHaveBeenCalledWith("lookup-id");
    expect(fetched).toMatchObject({ id: "lookup-id", name: "lookup.png" });
  });

  it("getImage returns undefined when getByID resolves with null/undefined", async () => {
    mockGetByID.mockResolvedValue(undefined);
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let fetched: ImageRecord | undefined;
    await act(async () => {
      fetched = await result.current.getImage("missing-id");
    });

    expect(fetched).toBeUndefined();
  });

  it("updateImage merges updates and calls update and refreshImages", async () => {
    const existing = createMockImageRecord({
      id: "update-id",
      ...createMockImageState({ name: "old.png", createdAt: 1000 }),
      file: testFile,
    });

    mockGetByID.mockResolvedValue(existing);
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.updateImage("update-id", {
        name: "new.png",
        breakpoints: [{ objectPosition: "25% 75%" }],
      });
    });

    expect(mockGetByID).toHaveBeenCalledWith("update-id");
    expect(mockUpdate).toHaveBeenCalledWith({
      ...existing,
      id: "update-id",
      name: "new.png",
      breakpoints: [{ objectPosition: "25% 75%" }],
      file: existing.file,
    });
    expect(mockGetAll).toHaveBeenCalledTimes(2);
  });

  it("updateImage does nothing when record is not found", async () => {
    mockGetByID.mockResolvedValue(undefined);
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.updateImage("missing-id", { name: "ignored.png" });
    });

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockGetAll).toHaveBeenCalledTimes(1); // only initial load
  });

  it("updateImage returns undefined and skips update when current and updated are deeply equal", async () => {
    const existing = createMockImageRecord({
      id: "update-id",
      ...createMockImageState({ name: "same.png", createdAt: 1000 }),
      file: testFile,
    });

    mockGetByID.mockResolvedValue(existing);
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    const returnValue = await act(async () => result.current.updateImage("update-id", {}));

    expect(returnValue).toBeUndefined();
    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockGetAll).toHaveBeenCalledTimes(1); // only initial load
  });

  it("deleteImage calls deleteRecord and refreshImages", async () => {
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.deleteImage("delete-id");
    });

    expect(mockDeleteRecord).toHaveBeenCalledWith("delete-id");
    expect(mockGetAll).toHaveBeenCalledTimes(2);
  });

  it("refreshImages reloads images from getAll", async () => {
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const record = createMockImageRecord({
      id: "refreshed-id",
      ...createMockImageState({ name: "refreshed.png" }),
      file: testFile,
    });

    mockGetAll.mockResolvedValue([record]);

    await act(async () => {
      await result.current.refreshImages();
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images?.[0]).toMatchObject({
      id: "refreshed-id",
      name: "refreshed.png",
    });
    expect(mockGetAll).toHaveBeenCalledTimes(2);
  });

  it("propagates errors when refreshImages (getAll) fails", async () => {
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    const dbError = new Error("IndexedDB unavailable");
    mockGetAll.mockRejectedValue(dbError);

    await expect(
      act(async () => {
        await result.current.refreshImages();
      }),
    ).rejects.toThrow();
  });

  it("propagates errors when addImage fails", async () => {
    mockGetAll.mockResolvedValue([]);
    mockAdd.mockRejectedValue(new Error("IndexedDB write failed"));

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    const imageState = createMockImageState();

    await expect(
      act(async () => {
        await result.current.addImage(imageState, testFile);
      }),
    ).rejects.toThrow("IndexedDB write failed");
  });

  it("propagates errors when getImage fails", async () => {
    mockGetByID.mockRejectedValue(new Error("IndexedDB read failed"));
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await expect(
      act(async () => {
        await result.current.getImage("any-id");
      }),
    ).rejects.toThrow("IndexedDB read failed");
  });

  it("propagates errors when updateImage fails", async () => {
    const existing = createMockImageRecord({
      id: "update-id",
      ...createMockImageState(),
      file: testFile,
    });

    mockGetByID.mockResolvedValue(existing);
    mockUpdate.mockRejectedValue(new Error("IndexedDB update failed"));
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await expect(
      act(async () => {
        await result.current.updateImage("update-id", { name: "new.png" });
      }),
    ).rejects.toThrow("IndexedDB update failed");
  });

  it("propagates errors when deleteImage fails", async () => {
    mockDeleteRecord.mockRejectedValue(new Error("IndexedDB delete failed"));
    mockGetAll.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await expect(
      act(async () => {
        await result.current.deleteImage("delete-id");
      }),
    ).rejects.toThrow("IndexedDB delete failed");
  });
});
