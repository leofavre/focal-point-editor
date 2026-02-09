import { isEqual } from "lodash";
import { useCallback, useEffect, useState } from "react";
import type { Err, Result } from "../../helpers/errorHandling";
import { accept, processResults, reject } from "../../helpers/errorHandling";
import { getIndexedDBService } from "../../services/indexedDBService";
import type { DatabaseService } from "../../services/types";
import type { ImageDraftStateAndFile, ImageRecord } from "../../types";
import { createImageId } from "../helpers/createImageId";

const noopIndexedDBService: DatabaseService<ImageRecord> = {
  addRecord: async () => {},
  getRecord: async () => undefined,
  getAllRecords: async () => [],
  updateRecord: async () => {},
  deleteRecord: async () => {},
};

export type UsePersistedImagesReturn = {
  images: ImageRecord[] | undefined;
  addImage: (draftAndFile: ImageDraftStateAndFile) => Promise<Result<string, "AddImageFailed">>;
  addImages: (
    draftsAndFiles: ImageDraftStateAndFile[],
  ) => Promise<{ accepted: string[]; rejected: Err<"AddImageFailed">[] }>;
  getImage: (id: string) => Promise<ImageRecord | undefined>;
  updateImage: (
    id: string,
    updates: Partial<ImageRecord>,
  ) => Promise<Result<string | undefined, "UpdateImageFailed">>;
  deleteImage: (id: string) => Promise<string | undefined>;
  refreshImages: () => Promise<Result<void, "RefreshFailed">>;
};

/**
 * Custom React hook for persisting image records in IndexedDB.
 * Unlike usePersistedUIRecord (one entry per id), this store holds many images
 * each identified by a human-friendly ID derived from the filename (with collision suffix).
 *
 * @returns Object with:
 * - `images`: all persisted image records (undefined until loaded).
 * - `addImage`: saves a single image via addImages; returns Result with id or AddImageFailed.
 * - `addImages`: saves multiple image records, then refreshes once; returns accepted ids and rejected reasons.
 * - `getImage`: fetches one image record by id.
 * - `updateImage`: merges partial image record into an existing record; returns Result.
 * - `deleteImage`: removes an image record by id.
 * - `refreshImages`: reloads the list from the database; returns Result.
 */
export function usePersistedImages(): UsePersistedImagesReturn {
  const indexedDBResult = getIndexedDBService<ImageRecord>("images");
  const { addRecord, getRecord, getAllRecords, updateRecord, deleteRecord } =
    indexedDBResult.rejected != null ? noopIndexedDBService : indexedDBResult.accepted;

  const [images, setImages] = useState<ImageRecord[] | undefined>(undefined);

  const refreshImages = useCallback(async (): Promise<Result<void, "RefreshFailed">> => {
    try {
      const all = await getAllRecords();
      setImages(all ?? []);
      return accept(undefined);
    } catch {
      return reject({ reason: "RefreshFailed" });
    }
  }, [getAllRecords]);

  useEffect(() => {
    refreshImages().then((result) => {
      /**
       * @todo Maybe show error to the user in the UI.
       */
      if (result.rejected != null) {
        console.error("Error refreshing images:", result.rejected.reason);
      }
    });
  }, [refreshImages]);

  const addImages = useCallback(
    async (
      draftsAndFiles: ImageDraftStateAndFile[],
    ): Promise<{ accepted: string[]; rejected: Err<"AddImageFailed">[] }> => {
      let existing: ImageRecord[];
      try {
        const all = await getAllRecords();
        existing = all ?? [];
      } catch {
        return processResults(draftsAndFiles.map(() => reject({ reason: "AddImageFailed" })));
      }
      const usedIds = new Set(existing.map((r) => r.id));

      const results: Result<string, "AddImageFailed">[] = [];
      for (const { imageDraft, file } of draftsAndFiles) {
        try {
          const id = createImageId(imageDraft.name, usedIds);
          const record: ImageRecord = { id, ...imageDraft, file };
          await addRecord(record);
          usedIds.add(id);
          results.push(accept(id));
        } catch {
          results.push(reject({ reason: "AddImageFailed" }));
        }
      }

      const { accepted: ids } = processResults(results);
      if (ids.length > 0) {
        const refreshResult = await refreshImages();
        /**
         * @todo Maybe show error to the user in the UI.
         */
        if (refreshResult.rejected != null) {
          console.error("Error refreshing images after add:", refreshResult.rejected.reason);
        }
      }
      return processResults(results);
    },
    [addRecord, getAllRecords, refreshImages],
  );

  const addImage = useCallback(
    async (draftAndFile: ImageDraftStateAndFile): Promise<Result<string, "AddImageFailed">> => {
      const { accepted: ids } = await addImages([draftAndFile]);
      const id = ids[0];
      if (id != null) return accept(id);
      return reject({ reason: "AddImageFailed" });
    },
    [addImages],
  );

  const getImage = useCallback(
    async (id: string) => {
      return await getRecord(id);
    },
    [getRecord],
  );

  const updateImage = useCallback(
    async (
      id: string,
      updates: Partial<ImageRecord>,
    ): Promise<Result<string | undefined, "UpdateImageFailed">> => {
      try {
        const current = await getRecord(id);
        if (current == null) return accept(undefined);

        const updated: ImageRecord = {
          ...current,
          ...updates,
          id,
          file: current.file,
        };
        if (isEqual(current, updated)) return accept(id);

        await updateRecord(updated);
        const refreshResult = await refreshImages();
        /**
         * @todo Maybe show error to the user in the UI.
         */
        if (refreshResult.rejected != null) {
          console.error("Error refreshing images after update:", refreshResult.rejected.reason);
        }
        return accept(id);
      } catch {
        return reject({ reason: "UpdateImageFailed" });
      }
    },
    [getRecord, updateRecord, refreshImages],
  );

  const deleteImage = useCallback(
    async (id: string) => {
      await deleteRecord(id);
      await refreshImages();
      return id;
    },
    [deleteRecord, refreshImages],
  );

  return {
    images,
    addImage,
    addImages,
    getImage,
    updateImage,
    deleteImage,
    refreshImages,
  };
}
