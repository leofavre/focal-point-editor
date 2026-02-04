import { isEqual } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { getIndexedDBService } from "../../services/indexedDBService";
import type { ImageDraftStateAndFile, ImageRecord } from "../../types";
import { createImageId } from "../helpers/createImageId";

/**
 * Custom React hook for persisting image records in IndexedDB.
 * Unlike usePersistedUIRecord (one entry per id), this store holds many images
 * each identified by a human-friendly ID derived from the filename (with collision suffix).
 *
 * @returns Object with:
 * - `images`: all persisted image records (undefined until loaded).
 * - `addImage`: save a single image via addImages; returns its id.
 * - `addImages`: save multiple image records, then refresh once; returns ids of successful adds.
 * - `getImage`: fetch one image record by id.
 * - `updateImage`: merge partial image record into an existing record.
 * - `deleteImage`: remove an image record by id.
 * - `refreshImages`: reload the list from the database.
 */
export function usePersistedImages(): {
  images: ImageRecord[] | undefined;
  addImage: (draftAndFile: ImageDraftStateAndFile) => Promise<string>;
  addImages: (draftsAndFiles: ImageDraftStateAndFile[]) => Promise<string[]>;
  getImage: (id: string) => Promise<ImageRecord | undefined>;
  updateImage: (id: string, updates: Partial<ImageRecord>) => Promise<string | undefined>;
  deleteImage: (id: string) => Promise<string | undefined>;
  refreshImages: () => Promise<void>;
} {
  const { addRecord, getRecord, getAllRecords, updateRecord, deleteRecord } =
    getIndexedDBService<ImageRecord>("images");

  const [images, setImages] = useState<ImageRecord[] | undefined>(undefined);

  const refreshImages = useCallback(async () => {
    try {
      const all = await getAllRecords();
      setImages(all ?? []);
    } catch (err) {
      throw new Error("Failed to refresh images", { cause: err });
    }
  }, [getAllRecords]);

  useEffect(() => {
    refreshImages();
  }, [refreshImages]);

  const addImages = useCallback(
    async (draftsAndFiles: ImageDraftStateAndFile[]): Promise<string[]> => {
      const existing = await getAllRecords();
      const usedIds = new Set((existing ?? []).map((r) => r.id));

      const ids: string[] = [];
      for (const { imageDraft, file } of draftsAndFiles) {
        try {
          const id = createImageId(imageDraft.name, usedIds);

          const record: ImageRecord = {
            id,
            ...imageDraft,
            file,
          };

          await addRecord(record);
          ids.push(id);
        } catch (err) {
          console.error("Error saving image to database:", err);
        }
      }
      if (ids.length > 0) {
        await refreshImages();
      }
      return ids;
    },
    [addRecord, getAllRecords, refreshImages],
  );

  const addImage = useCallback(
    async (draftAndFile: ImageDraftStateAndFile): Promise<string> => {
      const ids = await addImages([draftAndFile]);
      const id = ids[0];

      if (id == null) {
        throw new Error("Failed to add image");
      }

      return id;
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
    async (id: string, updates: Partial<ImageRecord>) => {
      const current = await getRecord(id);

      if (current == null) return;

      const updated: ImageRecord = {
        ...current,
        ...updates,
        id,
        file: current.file,
      };

      if (isEqual(current, updated)) return;

      await updateRecord(updated);
      await refreshImages();
      return id;
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
