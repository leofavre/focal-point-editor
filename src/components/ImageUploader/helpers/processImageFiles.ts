import type { ImageDraftState, ImageDraftStateAndFile } from "../../../types";

/**
 * Filters image files from a `FileList` and builds `ImageDraftStateAndFile` pairs for each.
 *
 * @returns An array of `ImageDraftStateAndFile` pairs. Returns an empty array when `files`
 *   is null, empty, or contains no image files.
 */
export function processImageFiles(files: FileList | null): ImageDraftStateAndFile[] {
  if (files == null || files.length === 0) return [];

  const result: ImageDraftStateAndFile[] = [];

  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) continue;

    const imageDraft: ImageDraftState = {
      name: file.name,
      type: file.type,
      createdAt: Date.now(),
      breakpoints: [],
    };

    result.push({ imageDraft, file });
  }

  return result;
}
