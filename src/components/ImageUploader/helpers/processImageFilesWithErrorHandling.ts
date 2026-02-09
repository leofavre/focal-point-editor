import type { ImageUploadValidationReason } from "../../../errorTypes";
import type { Result } from "../../../helpers/errorHandling";
import { accept, reject } from "../../../helpers/errorHandling";
import type { ImageDraftState, ImageDraftStateAndFile } from "../../../types";

export type ImageDraftStateAndFileResult = Result<
  ImageDraftStateAndFile,
  ImageUploadValidationReason
>;

export function processImageFilesWithErrorHandling(
  files: FileList | null,
): ImageDraftStateAndFileResult[] {
  const results: ImageDraftStateAndFileResult[] = [];

  if (files == null || files.length === 0) {
    results.push(reject({ reason: "NoFilesProvidedError" }));
    return results;
  }

  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) {
      results.push(reject({ reason: "NotImageError" }));
      continue;
    }

    const imageDraft: ImageDraftState = {
      name: file.name,
      type: file.type,
      createdAt: Date.now(),
      breakpoints: [],
    };

    results.push(accept({ imageDraft, file }));
  }

  return results;
}
