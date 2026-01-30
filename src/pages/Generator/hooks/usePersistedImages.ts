import { useCallback, useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import type { ImageRecord, ImageState } from "../types";

/**
 * Custom React hook for persisting image records in IndexedDB.
 * Unlike usePersistedUIRecord (one entry per id), this store holds many images
 * each identified by a generated random ID.
 *
 * @returns Object with:
 * - images: all persisted ImageRecord[] (undefined until loaded)
 * - addImage: save a new image, returns its id
 * - getImage: fetch one image by id
 * - updateImage: merge partial ImageState into an existing record
 * - deleteImage: remove an image by id
 * - refreshImages: reload the list from the database
 */
export function usePersistedImages(): {
  images: ImageRecord[] | undefined;
  addImage: (imageState: ImageState, file: Blob) => Promise<string>;
  getImage: (id: string) => Promise<ImageRecord | undefined>;
  updateImage: (id: string, updates: Partial<ImageState>) => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
  refreshImages: () => Promise<void>;
} {
  const { add, getByID, getAll, update, deleteRecord } = useIndexedDB("images");
  const [images, setImages] = useState<ImageRecord[] | undefined>(undefined);

  const refreshImages = useCallback(async () => {
    try {
      const all = await getAll<ImageRecord>();
      setImages(all ?? []);
    } catch {
      setImages([]);
    }
  }, [getAll]);

  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  const addImage = useCallback(
    async (imageState: ImageState, file: Blob): Promise<string> => {
      const id = crypto.randomUUID();
      const record: ImageRecord = {
        id,
        ...imageState,
        file,
      };
      await add(record);
      await refreshImages();
      return id;
    },
    [add, refreshImages],
  );

  const getImage = useCallback(
    async (id: string): Promise<ImageRecord | undefined> => {
      try {
        return (await getByID<ImageRecord>(id)) ?? undefined;
      } catch {
        return undefined;
      }
    },
    [getByID],
  );

  const updateImage = useCallback(
    async (id: string, updates: Partial<ImageState>): Promise<void> => {
      const current = await getByID<ImageRecord>(id);
      if (current == null) return;
      const updated: ImageRecord = {
        ...current,
        ...updates,
        id,
        file: current.file,
      };
      await update(updated);
      await refreshImages();
    },
    [getByID, update, refreshImages],
  );

  const deleteImage = useCallback(
    async (id: string): Promise<void> => {
      await deleteRecord(id);
      await refreshImages();
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
