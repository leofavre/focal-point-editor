import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createMockImageDraftState, createMockImageRecord } from "../../test-utils/mocks";
import type { ImageId, ImageRecord } from "../../types";
import { usePersistedImages } from "./usePersistedImages";

const { mockAddRecord, mockGetRecord, mockGetAllRecords, mockUpdateRecord, mockDeleteRecord } =
  vi.hoisted(() => ({
    mockAddRecord: vi.fn(),
    mockGetRecord: vi.fn(),
    mockGetAllRecords: vi.fn(),
    mockUpdateRecord: vi.fn(),
    mockDeleteRecord: vi.fn(),
  }));

vi.mock("../../services/indexedDBService", () => ({
  getIndexedDBService: vi.fn(() => ({
    accepted: {
      addRecord: mockAddRecord,
      getRecord: mockGetRecord,
      getAllRecords: mockGetAllRecords,
      updateRecord: mockUpdateRecord,
      deleteRecord: mockDeleteRecord,
    },
    rejected: undefined,
  })),
}));

describe("usePersistedImages", () => {
  const testFile = new Blob(["test"], { type: "image/png" });

  beforeEach(() => {
    mockGetAllRecords.mockResolvedValue([]);
    mockAddRecord.mockResolvedValue(undefined);
    mockGetRecord.mockResolvedValue(undefined);
    mockUpdateRecord.mockResolvedValue(undefined);
    mockDeleteRecord.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns images undefined initially, then loaded list after getAll resolves", async () => {
    const persisted: ImageRecord[] = [];
    mockGetAllRecords.mockResolvedValue(persisted);

    const { result } = renderHook(() => usePersistedImages());

    expect(result.current.images).toBeUndefined();

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    expect(mockGetAllRecords).toHaveBeenCalled();
  });

  it("returns persisted images when getAll resolves with data", async () => {
    const record = createMockImageRecord({
      id: "saved-id",
      ...createMockImageDraftState({ name: "saved.png" }),
      file: testFile,
    });

    mockGetAllRecords.mockResolvedValue([record]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
      expect(result.current.images?.[0]).toMatchObject({
        id: "saved-id",
        name: "saved.png",
      });
    });
  });

  it("addImage generates friendly id from filename, adds record, refreshes, and returns id", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const imageDraft = createMockImageDraftState({ name: "new.png" });

    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage({ imageDraft, file: testFile });
    });

    expect(addResult?.accepted).toBe("new");
    expect(mockAddRecord).toHaveBeenCalledWith({
      id: "new",
      ...imageDraft,
      file: testFile,
    });
    expect(mockGetAllRecords).toHaveBeenCalledTimes(3); // initial load + getAll for id + refresh after add
  });

  it("addImage uses collision suffix when filename already exists", async () => {
    const existingRecord = createMockImageRecord({
      id: "my-photo",
      ...createMockImageDraftState({ name: "My Photo.jpg" }),
      file: testFile,
    });
    mockGetAllRecords.mockResolvedValue([existingRecord]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    const imageDraft = createMockImageDraftState({ name: "My Photo.jpg" });
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage({ imageDraft, file: testFile });
    });

    expect(addResult?.accepted).toBe("my-photo-2");
    expect(mockAddRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "my-photo-2",
        name: "My Photo.jpg",
      }),
    );
  });

  it("addImage with overwrite: true uses base id and overwrites existing record via updateRecord", async () => {
    const existingRecord = createMockImageRecord({
      id: "my-photo",
      ...createMockImageDraftState({ name: "My Photo.jpg", createdAt: 1000 }),
      file: testFile,
    });
    mockGetAllRecords.mockResolvedValue([existingRecord]);
    mockGetRecord.mockResolvedValue(existingRecord);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    const imageDraft = createMockImageDraftState({
      name: "My Photo.jpg",
      createdAt: 2000,
      breakpoints: [{ objectPosition: "50% 50%" }],
    });
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage(
        { imageDraft, file: testFile },
        { overwrite: true },
      );
    });

    expect(addResult?.accepted).toBe("my-photo");
    expect(mockGetRecord).toHaveBeenCalledWith("my-photo");
    expect(mockUpdateRecord).toHaveBeenCalledWith({
      id: "my-photo",
      ...imageDraft,
      file: testFile,
    });
    expect(mockAddRecord).not.toHaveBeenCalled();
  });

  it("addImage with overwrite: true when no existing record calls addRecord", async () => {
    mockGetAllRecords.mockResolvedValue([]);
    mockGetRecord.mockResolvedValue(undefined);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const imageDraft = createMockImageDraftState({ name: "New.png" });
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage(
        { imageDraft, file: testFile },
        { overwrite: true },
      );
    });

    expect(addResult?.accepted).toBe("new");
    expect(mockGetRecord).toHaveBeenCalledWith("new");
    expect(mockAddRecord).toHaveBeenCalledWith({
      id: "new",
      ...imageDraft,
      file: testFile,
    });
    expect(mockUpdateRecord).not.toHaveBeenCalled();
  });

  it("addImages with overwrite: true overwrites existing and adds new", async () => {
    const existingRecord = createMockImageRecord({
      id: "photo",
      ...createMockImageDraftState({ name: "photo.jpg" }),
      file: testFile,
    });
    mockGetAllRecords.mockResolvedValue([existingRecord]);
    mockGetRecord
      .mockResolvedValueOnce(existingRecord) // first draft overwrites "photo"
      .mockResolvedValueOnce(undefined); // second draft is new

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    const draft1 = createMockImageDraftState({ name: "photo.jpg", createdAt: 2 });
    const draft2 = createMockImageDraftState({ name: "other.png" });
    let addResults: Awaited<ReturnType<typeof result.current.addImages>> | undefined;
    await act(async () => {
      addResults = await result.current.addImages(
        [
          { imageDraft: draft1, file: testFile },
          { imageDraft: draft2, file: testFile },
        ],
        { overwrite: true },
      );
    });

    expect(addResults?.accepted).toEqual(["photo", "other"]);
    expect(mockUpdateRecord).toHaveBeenCalledTimes(1);
    expect(mockUpdateRecord).toHaveBeenCalledWith({
      id: "photo",
      ...draft1,
      file: testFile,
    });
    expect(mockAddRecord).toHaveBeenCalledTimes(1);
    expect(mockAddRecord).toHaveBeenCalledWith({
      id: "other",
      ...draft2,
      file: testFile,
    });
  });

  it("addImage with options.id uses explicit id instead of generating from filename", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const imageDraft = createMockImageDraftState({ name: "any-name.png" });
    const explicitId = "my-custom-id" as ImageId;
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage(
        { imageDraft, file: testFile },
        { id: explicitId },
      );
    });

    expect(addResult?.accepted).toBe("my-custom-id");
    expect(mockAddRecord).toHaveBeenCalledWith({
      id: "my-custom-id",
      ...imageDraft,
      file: testFile,
    });
  });

  it("addImage with options.id overwrites existing record", async () => {
    const existingRecord = createMockImageRecord({
      id: "custom-id",
      ...createMockImageDraftState({ name: "old.png" }),
      file: testFile,
    });
    mockGetAllRecords.mockResolvedValue([existingRecord]);
    mockGetRecord.mockResolvedValue(existingRecord);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    const imageDraft = createMockImageDraftState({
      name: "new.png",
      breakpoints: [{ objectPosition: "100% 0%" }],
    });
    const explicitId = "custom-id" as ImageId;
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage(
        { imageDraft, file: testFile },
        { id: explicitId },
      );
    });

    expect(addResult?.accepted).toBe("custom-id");
    expect(mockUpdateRecord).toHaveBeenCalledWith({
      id: "custom-id",
      ...imageDraft,
      file: testFile,
    });
    expect(mockAddRecord).not.toHaveBeenCalled();
  });

  it("addImages generates ids for all items and adds records", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const draft1 = createMockImageDraftState({ name: "first.png" });
    const draft2 = createMockImageDraftState({ name: "second.png" });
    let addResults: Awaited<ReturnType<typeof result.current.addImages>> | undefined;
    await act(async () => {
      addResults = await result.current.addImages([
        { imageDraft: draft1, file: testFile },
        { imageDraft: draft2, file: testFile },
      ]);
    });

    expect(addResults?.accepted).toEqual(["first", "second"]);
    expect(mockAddRecord).toHaveBeenCalledWith({
      id: "first",
      ...draft1,
      file: testFile,
    });
    expect(mockAddRecord).toHaveBeenCalledWith({
      id: "second",
      ...draft2,
      file: testFile,
    });
  });

  it("getImage returns record when getByID resolves", async () => {
    const id = "lookup-id" as ImageId;

    const record = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "lookup.png" }),
      file: testFile,
    });

    mockGetRecord.mockResolvedValue(record);
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let fetched: ImageRecord | undefined;
    await act(async () => {
      fetched = await result.current.getImage(id);
    });

    expect(mockGetRecord).toHaveBeenCalledWith(id);
    expect(fetched).toMatchObject({ id, name: "lookup.png" });
  });

  it("getImage returns undefined when getByID resolves with null/undefined", async () => {
    mockGetRecord.mockResolvedValue(undefined);
    mockGetAllRecords.mockResolvedValue([]);

    const id = "missing-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let fetched: ImageRecord | undefined;
    await act(async () => {
      fetched = await result.current.getImage(id);
    });

    expect(fetched).toBeUndefined();
  });

  it("updateImage merges updates and calls update and refreshImages", async () => {
    const id = "update-id" as ImageId;
    const existing = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "old.png", createdAt: 1000 }),
      file: testFile,
    });

    mockGetRecord.mockResolvedValue(existing);
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.updateImage(id, {
        name: "new.png",
        breakpoints: [{ objectPosition: "25% 75%" }],
      });
    });

    expect(mockGetRecord).toHaveBeenCalledWith(id);
    expect(mockUpdateRecord).toHaveBeenCalledWith({
      ...existing,
      id,
      name: "new.png",
      breakpoints: [{ objectPosition: "25% 75%" }],
      file: existing.file,
    });
    expect(mockGetAllRecords).toHaveBeenCalledTimes(2);
  });

  it("updateImage does nothing when record is not found", async () => {
    mockGetRecord.mockResolvedValue(undefined);
    mockGetAllRecords.mockResolvedValue([]);

    const id = "missing-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.updateImage(id, { name: "ignored.png" });
    });

    expect(mockUpdateRecord).not.toHaveBeenCalled();
    expect(mockGetAllRecords).toHaveBeenCalledTimes(1); // only initial load
  });

  it("updateImage returns undefined and skips update when current and updated are deeply equal", async () => {
    const id = "update-id" as ImageId;
    const existing = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "same.png", createdAt: 1000 }),
      file: testFile,
    });

    mockGetRecord.mockResolvedValue(existing);
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    const updateResult = await act(async () => result.current.updateImage(id, {}));

    expect(updateResult?.accepted).toBe(id);
    expect(mockUpdateRecord).not.toHaveBeenCalled();
    expect(mockGetAllRecords).toHaveBeenCalledTimes(1); // only initial load
  });

  it("deleteImage calls deleteRecord and refreshImages", async () => {
    const id = "delete-id" as ImageId;
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.deleteImage(id);
    });

    expect(mockDeleteRecord).toHaveBeenCalledWith(id);
    expect(mockGetAllRecords).toHaveBeenCalledTimes(2);
  });

  it("refreshImages reloads images from getAll", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const record = createMockImageRecord({
      id: "refreshed-id",
      ...createMockImageDraftState({ name: "refreshed.png" }),
      file: testFile,
    });

    mockGetAllRecords.mockResolvedValue([record]);

    await act(async () => {
      await result.current.refreshImages();
    });

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images?.[0]).toMatchObject({
      id: "refreshed-id",
      name: "refreshed.png",
    });
    expect(mockGetAllRecords).toHaveBeenCalledTimes(2);
  });

  it("returns rejected when refreshImages (getAll) fails", async () => {
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    mockGetAllRecords.mockRejectedValue(new Error("IndexedDB unavailable"));

    let refreshResult: Awaited<ReturnType<typeof result.current.refreshImages>> | undefined;
    await act(async () => {
      refreshResult = await result.current.refreshImages();
    });

    expect(refreshResult?.rejected).toEqual({ reason: "RefreshFailed" });
  });

  it("returns rejected when addImage fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    mockGetAllRecords.mockResolvedValue([]);
    mockAddRecord.mockRejectedValue(new Error("IndexedDB write failed"));

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    const imageDraft = createMockImageDraftState();

    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage({ imageDraft, file: testFile });
    });

    expect(addResult?.rejected).toEqual({ reason: "AddImageFailed" });
  });

  it("propagates errors when getImage fails", async () => {
    mockGetRecord.mockRejectedValue(new Error("IndexedDB read failed"));
    mockGetAllRecords.mockResolvedValue([]);

    const id = "any-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await expect(
      act(async () => {
        await result.current.getImage(id);
      }),
    ).rejects.toThrow("IndexedDB read failed");
  });

  it("returns rejected when updateImage fails", async () => {
    const id = "update-id" as ImageId;

    const existing = createMockImageRecord({
      id,
      ...createMockImageDraftState(),
      file: testFile,
    });

    mockGetRecord.mockResolvedValue(existing);
    mockUpdateRecord.mockRejectedValue(new Error("IndexedDB update failed"));
    mockGetAllRecords.mockResolvedValue([]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let updateResult: Awaited<ReturnType<typeof result.current.updateImage>> | undefined;
    await act(async () => {
      updateResult = await result.current.updateImage(id, { name: "new.png" });
    });

    expect(updateResult?.rejected).toEqual({ reason: "UpdateImageFailed" });
  });

  it("propagates errors when deleteImage fails", async () => {
    mockDeleteRecord.mockRejectedValue(new Error("IndexedDB delete failed"));
    mockGetAllRecords.mockResolvedValue([]);

    const id = "delete-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await expect(
      act(async () => {
        await result.current.deleteImage(id);
      }),
    ).rejects.toThrow("IndexedDB delete failed");
  });

  describe("enabled option", () => {
    it("when enabled is false, images is always undefined", async () => {
      mockGetAllRecords.mockResolvedValue([
        createMockImageRecord({
          id: "any-id",
          ...createMockImageDraftState({ name: "any.png" }),
          file: testFile,
        }),
      ]);

      const { result } = renderHook(() => usePersistedImages({ enabled: false }));

      expect(result.current.images).toBeUndefined();

      await waitFor(() => {
        expect(result.current.images).toBeUndefined();
      });

      await act(async () => {
        await result.current.refreshImages();
      });
      expect(result.current.images).toBeUndefined();
    });

    it("when enabled is false, does not load images or call getAllRecords", async () => {
      mockGetAllRecords.mockResolvedValue([]);

      const { result } = renderHook(() => usePersistedImages({ enabled: false }));

      await waitFor(() => {
        expect(result.current.images).toBeUndefined();
      });

      expect(mockGetAllRecords).not.toHaveBeenCalled();
    });

    it("when enabled is false, refreshImages resolves without calling getAllRecords", async () => {
      const { result } = renderHook(() => usePersistedImages({ enabled: false }));

      let refreshResult: Awaited<ReturnType<typeof result.current.refreshImages>> | undefined;
      await act(async () => {
        refreshResult = await result.current.refreshImages();
      });

      expect(refreshResult?.accepted).toBeUndefined();
      expect(refreshResult?.rejected).toBeUndefined();
      expect(mockGetAllRecords).not.toHaveBeenCalled();
      expect(result.current.images).toBeUndefined();
    });

    it("when enabled is false, addImage does not call addRecord and images stay undefined", async () => {
      const { result } = renderHook(() => usePersistedImages({ enabled: false }));

      const imageDraft = createMockImageDraftState({ name: "no-persist.png" });
      let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
      await act(async () => {
        addResult = await result.current.addImage({ imageDraft, file: testFile });
      });

      expect(addResult?.accepted).toBe("no-persist");
      expect(mockAddRecord).not.toHaveBeenCalled();
      expect(mockGetAllRecords).not.toHaveBeenCalled();
      expect(result.current.images).toBeUndefined();
    });

    it("when enabled is false, getImage returns undefined without calling getRecord", async () => {
      const id = "any-id" as ImageId;
      const { result } = renderHook(() => usePersistedImages({ enabled: false }));

      let fetched: ImageRecord | undefined;
      await act(async () => {
        fetched = await result.current.getImage(id);
      });

      expect(fetched).toBeUndefined();
      expect(mockGetRecord).not.toHaveBeenCalled();
    });

    it("when enabled is false, updateImage returns accepted undefined without calling getRecord or updateRecord", async () => {
      const id = "update-id" as ImageId;
      const { result } = renderHook(() => usePersistedImages({ enabled: false }));

      let updateResult: Awaited<ReturnType<typeof result.current.updateImage>> | undefined;
      await act(async () => {
        updateResult = await result.current.updateImage(id, { name: "ignored.png" });
      });

      expect(updateResult?.accepted).toBeUndefined();
      expect(mockGetRecord).not.toHaveBeenCalled();
      expect(mockUpdateRecord).not.toHaveBeenCalled();
    });

    it("when enabled is false, deleteImage does not call deleteRecord", async () => {
      const id = "delete-id" as ImageId;
      const { result } = renderHook(() => usePersistedImages({ enabled: false }));

      const deleted = await act(async () => result.current.deleteImage(id));

      expect(deleted).toBe(id);
      expect(mockDeleteRecord).not.toHaveBeenCalled();
      expect(mockGetAllRecords).not.toHaveBeenCalled();
    });

    it("when enabled is true explicitly, loads images as when default", async () => {
      const record = createMockImageRecord({
        id: "explicit-enabled",
        ...createMockImageDraftState({ name: "explicit.png" }),
        file: testFile,
      });
      mockGetAllRecords.mockResolvedValue([record]);

      const { result } = renderHook(() => usePersistedImages({ enabled: true }));

      await waitFor(() => {
        expect(result.current.images).toHaveLength(1);
        expect(result.current.images?.[0]).toMatchObject({
          id: "explicit-enabled",
          name: "explicit.png",
        });
      });
      expect(mockGetAllRecords).toHaveBeenCalled();
    });
  });
});
