/**
 * Tests for usePersistedImages.
 * These tests depend on the fake IndexedDB provided by the test environment: vitest.setup.ts
 * imports "fake-indexeddb/auto", so the global indexedDB in tests is the fake implementation.
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { DBConfig } from "../../services/databaseConfig";
import { getIndexedDBService } from "../../services/indexedDBService";
import { __clearTableForTesting } from "../../services/inMemoryStorageService";
import { clearIndexedDBStores } from "../../test-utils/clearIndexedDBStores";
import { expectAccepted } from "../../test-utils/expectAccepted";
import { createMockImageDraftState, createMockImageRecord } from "../../test-utils/mocks";
import type { ImageId, ImageRecord } from "../../types";
import { usePersistedImages } from "./usePersistedImages";

const testFile = new Blob(["test"], { type: "image/png" });

/** Seeds the IndexedDB "images" store with the given records (used for tests that need pre-seeded data). */
async function seedImagesStore(records: ImageRecord[]): Promise<void> {
  const { result, unmount } = renderHook(() =>
    getIndexedDBService<ImageRecord>(DBConfig, "images"),
  );
  for (const record of records) {
    await act(async () => {
      await expectAccepted(result.current.addRecord(record));
    });
  }
  unmount();
}

describe("usePersistedImages", () => {
  beforeEach(async () => {
    await clearIndexedDBStores(DBConfig.name, DBConfig.version);
    __clearTableForTesting("images");
  });

  it("returns images undefined initially, then loaded list after getAll resolves", async () => {
    const { result } = renderHook(() => usePersistedImages());

    expect(result.current.images).toBeUndefined();

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });
  });

  it("initial load effect does not cause an infinite loop (load completes with empty list)", async () => {
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });
  });

  it("returns persisted images when store has data", async () => {
    const record = createMockImageRecord({
      id: "saved-id",
      ...createMockImageDraftState({ name: "saved.png" }),
      file: testFile,
    });
    await seedImagesStore([record]);

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
    expect(result.current.images).toHaveLength(1);
    expect(result.current.images?.[0]).toMatchObject({
      id: "new",
      ...imageDraft,
    });
  });

  it("addImage uses collision suffix when filename already exists", async () => {
    const existingRecord = createMockImageRecord({
      id: "my-photo",
      ...createMockImageDraftState({ name: "My Photo.jpg" }),
      file: testFile,
    });
    await seedImagesStore([existingRecord]);

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
    expect(result.current.images).toHaveLength(2);
    expect(result.current.images?.some((img) => img.id === "my-photo-2")).toBe(true);
  });

  it("addImage with overwrite: true uses base id and overwrites existing record", async () => {
    const existingRecord = createMockImageRecord({
      id: "my-photo",
      ...createMockImageDraftState({ name: "My Photo.jpg", createdAt: 1000 }),
      file: testFile,
    });
    await seedImagesStore([existingRecord]);

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
    expect(result.current.images).toHaveLength(1);
    expect(result.current.images?.[0]).toMatchObject({
      id: "my-photo",
      createdAt: 2000,
      breakpoints: [{ objectPosition: "50% 50%" }],
    });
  });

  it("addImage with overwrite: true when no existing record creates record", async () => {
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
    expect(result.current.images).toHaveLength(1);
    expect(result.current.images?.[0]?.id).toBe("new");
  });

  it("addImages with overwrite: true overwrites existing and adds new", async () => {
    const existingRecord = createMockImageRecord({
      id: "photo",
      ...createMockImageDraftState({ name: "photo.jpg" }),
      file: testFile,
    });
    await seedImagesStore([existingRecord]);

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
    expect(result.current.images).toHaveLength(2);
    expect(result.current.images?.find((img) => img.id === "photo")?.createdAt).toBe(2);
    expect(result.current.images?.some((img) => img.id === "other")).toBe(true);
  });

  it("addImage with options.id uses explicit id", async () => {
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toEqual([]);
    });

    const imageDraft = createMockImageDraftState({ name: "any-name.png" });
    const explicitId = "my-custom-id" as ImageId;
    let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
    await act(async () => {
      addResult = await result.current.addImage({ imageDraft, file: testFile }, { id: explicitId });
    });

    expect(addResult?.accepted).toBe("my-custom-id");
    expect(result.current.images).toHaveLength(1);
    expect(result.current.images?.[0]?.id).toBe("my-custom-id");
  });

  it("addImage with options.id overwrites existing record", async () => {
    const existingRecord = createMockImageRecord({
      id: "custom-id",
      ...createMockImageDraftState({ name: "old.png" }),
      file: testFile,
    });
    await seedImagesStore([existingRecord]);

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
      addResult = await result.current.addImage({ imageDraft, file: testFile }, { id: explicitId });
    });

    expect(addResult?.accepted).toBe("custom-id");
    expect(result.current.images).toHaveLength(1);
    expect(result.current.images?.[0]).toMatchObject({
      id: "custom-id",
      name: "new.png",
      breakpoints: [{ objectPosition: "100% 0%" }],
    });
  });

  it("addImages generates ids for all items and adds records", async () => {
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
    expect(result.current.images).toHaveLength(2);
    expect(result.current.images?.map((img) => img.id).sort()).toEqual(["first", "second"]);
  });

  it("getImage returns record when present", async () => {
    const id = "lookup-id" as ImageId;
    const record = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "lookup.png" }),
      file: testFile,
    });
    await seedImagesStore([record]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    let fetched: ImageRecord | undefined;
    await act(async () => {
      fetched = await result.current.getImage(id);
    });

    expect(fetched).toMatchObject({ id, name: "lookup.png" });
  });

  it("getImage returns undefined when record is missing", async () => {
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

  it("updateImage merges updates and refreshes list", async () => {
    const id = "update-id" as ImageId;
    const existing = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "old.png", createdAt: 1000 }),
      file: testFile,
    });
    await seedImagesStore([existing]);

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

    expect(result.current.images).toHaveLength(1);
    expect(result.current.images?.[0]).toMatchObject({
      id,
      name: "new.png",
      breakpoints: [{ objectPosition: "25% 75%" }],
    });
  });

  it("updateImage does nothing when record is not found", async () => {
    const id = "missing-id" as ImageId;
    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    await act(async () => {
      await result.current.updateImage(id, { name: "ignored.png" });
    });

    expect(result.current.images).toEqual([]);
  });

  it("updateImage returns accepted and skips write when current and updated are deeply equal", async () => {
    const id = "update-id" as ImageId;
    const existing = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "same.png", createdAt: 1000 }),
      file: testFile,
    });
    await seedImagesStore([existing]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toBeDefined();
    });

    const updateResult = await act(async () => result.current.updateImage(id, {}));

    expect(updateResult?.accepted).toBe(id);
    expect(result.current.images?.[0]?.createdAt).toBe(1000);
  });

  it("deleteImage removes record and refreshes list", async () => {
    const id = "delete-id" as ImageId;
    const record = createMockImageRecord({
      id,
      ...createMockImageDraftState({ name: "to-delete.png" }),
      file: testFile,
    });
    await seedImagesStore([record]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    await act(async () => {
      await result.current.deleteImage(id);
    });

    expect(result.current.images).toEqual([]);
  });

  it("refreshImages reloads images from store", async () => {
    const record1 = createMockImageRecord({
      id: "refreshed-id",
      ...createMockImageDraftState({ name: "refreshed.png" }),
      file: testFile,
    });
    await seedImagesStore([record1]);

    const { result } = renderHook(() => usePersistedImages());

    await waitFor(() => {
      expect(result.current.images).toHaveLength(1);
    });

    const record2 = createMockImageRecord({
      id: "second-id",
      ...createMockImageDraftState({ name: "second.png" }),
      file: testFile,
    });
    const { result: serviceResult, unmount } = renderHook(() =>
      getIndexedDBService<ImageRecord>(DBConfig, "images"),
    );
    await act(async () => {
      await serviceResult.current.addRecord(record2);
    });
    unmount();

    await act(async () => {
      await result.current.refreshImages();
    });

    expect(result.current.images).toHaveLength(2);
    expect(result.current.images?.map((img) => img.id).sort()).toEqual([
      "refreshed-id",
      "second-id",
    ]);
  });

  describe("forceInMemoryStorage option", () => {
    it("when forceInMemoryStorage is true, uses in-memory storage and operations succeed", async () => {
      const { result } = renderHook(() => usePersistedImages({ forceInMemoryStorage: true }));

      await waitFor(() => {
        expect(result.current.images).toBeDefined();
      });

      const imageDraft = createMockImageDraftState({ name: "ephemeral.png" });
      let addResult: Awaited<ReturnType<typeof result.current.addImage>> | undefined;
      await act(async () => {
        addResult = await result.current.addImage({ imageDraft, file: testFile });
      });

      expect(addResult?.accepted).toBe("ephemeral");
      expect(result.current.images).toHaveLength(1);
    });

    it("when forceInMemoryStorage is true, data is not persisted to IndexedDB", async () => {
      const { result: resultInMemory, unmount } = renderHook(() =>
        usePersistedImages({ forceInMemoryStorage: true }),
      );

      await waitFor(() => {
        expect(resultInMemory.current.images).toBeDefined();
      });

      const imageDraft = createMockImageDraftState({ name: "ephemeral.png" });
      await act(async () => {
        await resultInMemory.current.addImage({ imageDraft, file: testFile });
      });

      expect(resultInMemory.current.images).toHaveLength(1);
      unmount();

      __clearTableForTesting("images");
      const { result: resultIndexedDB } = renderHook(() => usePersistedImages());

      await waitFor(() => {
        expect(resultIndexedDB.current.images).toBeDefined();
      });

      expect(resultIndexedDB.current.images).toEqual([]);
    });
  });
});
