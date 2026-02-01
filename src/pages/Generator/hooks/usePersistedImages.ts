import isEqual from "lodash/isequalWith";
import { useCallback, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import type { ImageDraftState, ImageRecord } from "../../../types";

/**
 * Custom React hook for persisting image records in IndexedDB.
 * Unlike usePersistedUIRecord (one entry per id), this store holds many images
 * each identified by a generated random ID.
 *
 * @returns Object with:
 * - `images`: all persisted image records (undefined until loaded).
 * - `addImage`: save a new image record, returns its id.
 * - `getImage`: fetch one image record by id.
 * - `updateImage`: merge partial image record into an existing record.
 * - `deleteImage`: remove an image record by id.
 * - `refreshImages`: reload the list from the database.
 */
export function usePersistedImages(): {
  images: ImageRecord[] | undefined;
  addImage: (imageDraftState: ImageDraftState, file: Blob) => Promise<string>;
  getImage: (id: string) => Promise<ImageRecord | undefined>;
  updateImage: (id: string, updates: Partial<ImageRecord>) => Promise<string | undefined>;
  deleteImage: (id: string) => Promise<string | undefined>;
  refreshImages: () => Promise<void>;
} {
  const { add, getByID, getAll, update, deleteRecord } = useIndexedDB("images");
  const [images, setImages] = useState<ImageRecord[] | undefined>(undefined);

  const refreshImages = useCallback(async () => {
    try {
      const all = await getAll<ImageRecord>();
      setImages(all ?? []);
    } catch (err) {
      throw new Error("Failed to refresh images", { cause: err });
    }
  }, [getAll]);

  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  const addImage = useCallback(
    async (imageDraftState: ImageDraftState, file: Blob) => {
      const id = crypto.randomUUID();

      const record: ImageRecord = {
        id,
        ...imageDraftState,
        file,
      };

      await add(record);
      await refreshImages();
      return id;
    },
    [add, refreshImages],
  );

  const getImage = useCallback(
    async (id: string) => {
      return await getByID<ImageRecord>(id);
    },
    [getByID],
  );

  const updateImage = useCallback(
    async (id: string, updates: Partial<ImageRecord>) => {
      const current = await getByID<ImageRecord>(id);

      if (current == null) return;

      const updated: ImageRecord = {
        ...current,
        ...updates,
        id,
        file: current.file,
      };

      if (isEqual(current, updated)) return;

      await update(updated);
      await refreshImages();
      return id;
    },
    [getByID, update, refreshImages],
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
    getImage,
    updateImage,
    deleteImage,
    refreshImages,
  };
}
