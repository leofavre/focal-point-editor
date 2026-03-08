import type { ImageUploadValidationReason } from "@/src/errorTypes";
import type { Result } from "@/src/helpers/errorHandling";
import { accept, reject } from "@/src/helpers/errorHandling";
import type { ImageDraftState, ImageDraftStateAndFile } from "@/src/types";

export type ImageDraftStateAndFileResult = Result<
  ImageDraftStateAndFile,
  ImageUploadValidationReason
>;

export type ProcessImageFilesOptions = {
  /** When false, single-file mode; used for error message ("No file" vs "No files"). */
  multiple?: boolean;
};

export function processImageFilesWithErrorHandling(
  files: FileList | null,
  options?: ProcessImageFilesOptions,
): ImageDraftStateAndFileResult[] {
  const results: ImageDraftStateAndFileResult[] = [];
  const multiple = options?.multiple ?? true;

  if (files == null || files.length === 0) {
    results.push(reject({ reason: multiple ? "NoFilesProvidedError" : "NoFileProvidedError" }));
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
