import { isEqual } from "lodash";
import { useCallback, useEffect, useEffectEvent, useState } from "react";
import toast from "react-hot-toast";
import type { Err, Result } from "../../helpers/errorHandling";
import { accept, processResults, reject } from "../../helpers/errorHandling";
import { getIndexedDBService } from "../../services/indexedDBService";
import type { DatabaseService } from "../../services/types";
import type { ImageDraftStateAndFile, ImageId, ImageRecord } from "../../types";
import { createImageId } from "../helpers/createImageId";

export type UsePersistedImagesOptions = {
  enabled?: boolean;
  onRefreshImagesError?: (error: Err<"RefreshFailed">) => void;
};

const noopIndexedDBService: DatabaseService<ImageRecord> = {
  addRecord: async () => {},
  getRecord: async () => undefined,
  getAllRecords: async () => [],
  updateRecord: async () => {},
  deleteRecord: async () => {},
};

export type AddImagesOptions = {
  /** When true, use the base ID from the filename (no collision suffix). If a record with that ID exists, it is overwritten. */
  overwrite?: boolean;
};

export type UsePersistedImagesReturn = {
  images: ImageRecord[] | undefined;
  addImage: (
    draftAndFile: ImageDraftStateAndFile,
    options?: AddImagesOptions,
  ) => Promise<Result<ImageId, "AddImageFailed">>;
  addImages: (
    draftsAndFiles: ImageDraftStateAndFile[],
    options?: AddImagesOptions,
  ) => Promise<{ accepted: ImageId[]; rejected: Err<"AddImageFailed">[] }>;
  getImage: (id: ImageId) => Promise<ImageRecord | undefined>;
  updateImage: (
    id: ImageId,
    updates: Partial<ImageRecord>,
  ) => Promise<Result<ImageId | undefined, "UpdateImageFailed">>;
  deleteImage: (id: ImageId) => Promise<ImageId | undefined>;
  refreshImages: () => Promise<Result<void, "RefreshFailed">>;
};

/**
 * Custom React hook for persisting image records in IndexedDB.
 *
 * Unlike usePersistedUIRecord (one entry per id), this store holds many images
 * each identified by a human-friendly ID derived from the filename (with collision suffix).
 *
 * `enabled` (default `true`) can be set to `false` to disable persistence; when disabled,
 * no IndexedDB reads or writes occur, `images` is always `undefined` (never loaded), and
 * mutating methods (addImage, updateImage, deleteImage) no-op without touching the database.
 *
 * `onRefreshImagesError` can be passed as an option to be called when the initial refresh
 * fails (e.g. IndexedDB unavailable).
 *
 * @returns Object with:
 * - `images`: all persisted image records (undefined until loaded).
 * - `addImage(draftAndFile, options?)`: saves a single image via addImages; returns Result with id or AddImageFailed. Pass `{ overwrite: true }` to use the base ID from the filename and overwrite an existing record with that id.
 * - `addImages(draftsAndFiles, options?)`: saves multiple image records, then refreshes once; returns accepted ids and rejected reasons. Pass `{ overwrite: true }` to use base IDs and overwrite existing records with the same id.
 * - `getImage`: fetches one image record by id.
 * - `updateImage`: merges partial image record into an existing record; returns Result.
 * - `deleteImage`: removes an image record by id.
 * - `refreshImages`: reloads the list from the database; returns Result.
 */
export function usePersistedImages(options?: UsePersistedImagesOptions): UsePersistedImagesReturn {
  const { enabled = true, onRefreshImagesError } = options ?? {};
  const indexedDBResult = getIndexedDBService<ImageRecord>("images");
  const isEnabled = indexedDBResult.rejected == null && enabled;

  const { addRecord, getRecord, getAllRecords, updateRecord, deleteRecord } = isEnabled
    ? indexedDBResult.accepted
    : noopIndexedDBService;

  const [images, setImages] = useState<ImageRecord[] | undefined>(undefined);

  const refreshImages: UsePersistedImagesReturn["refreshImages"] = useCallback(async () => {
    if (!isEnabled) {
      return accept(undefined);
    }

    try {
      const all = await getAllRecords();
      setImages(all ?? []);
      return accept(undefined);
    } catch {
      return reject({ reason: "RefreshFailed" });
    }
  }, [isEnabled, getAllRecords]);

  const stableOnRefreshImagesError = useEffectEvent((err: Err<"RefreshFailed">) =>
    onRefreshImagesError?.(err),
  );

  useEffect(() => {
    refreshImages().then((result) => {
      if (result.rejected == null) return;
      stableOnRefreshImagesError(result.rejected);
    });
  }, [refreshImages]);

  const addImages: UsePersistedImagesReturn["addImages"] = useCallback(
    async (draftsAndFiles, options) => {
      const overwrite = options?.overwrite ?? false;

      let usedIds: Set<string> | undefined;
      if (!overwrite) {
        try {
          const all = await getAllRecords();
          const existing = all ?? [];
          usedIds = new Set(existing.map((r) => r.id));
        } catch {
          return processResults(draftsAndFiles.map(() => reject({ reason: "AddImageFailed" })));
        }
      }

      const results: Result<ImageId, "AddImageFailed">[] = [];
      for (const { imageDraft, file } of draftsAndFiles) {
        try {
          const id = createImageId(imageDraft.name, usedIds);
          const record: ImageRecord = { id, ...imageDraft, file };
          if (overwrite) {
            const existingRecord = await getRecord(id);
            if (existingRecord != null) {
              await updateRecord(record);
            } else {
              await addRecord(record);
            }
          } else {
            await addRecord(record);
            if (usedIds != null) usedIds.add(id);
          }
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
          toast.error(
            `Error refreshing images after add: ${String(refreshResult.rejected.reason)}`,
          );
        }
      }
      return processResults(results);
    },
    [addRecord, getRecord, getAllRecords, updateRecord, refreshImages],
  );

  const addImage: UsePersistedImagesReturn["addImage"] = useCallback(
    async (draftAndFile, options) => {
      const { accepted: ids } = await addImages([draftAndFile], options);
      const id = ids[0];
      if (id != null) return accept(id);
      return reject({ reason: "AddImageFailed" });
    },
    [addImages],
  );

  const getImage: UsePersistedImagesReturn["getImage"] = useCallback(
    async (id) => {
      return await getRecord(id);
    },
    [getRecord],
  );

  const updateImage: UsePersistedImagesReturn["updateImage"] = useCallback(
    async (id, updates) => {
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
          toast.error(
            `Error refreshing images after update: ${String(refreshResult.rejected.reason)}`,
          );
        }
        return accept(id);
      } catch {
        return reject({ reason: "UpdateImageFailed" });
      }
    },
    [getRecord, updateRecord, refreshImages],
  );

  const deleteImage: UsePersistedImagesReturn["deleteImage"] = useCallback(
    async (id) => {
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
