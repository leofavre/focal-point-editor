import { err, ok, type Result } from "../../../helpers/errorHandling";
import type { ImageDraftState, ImageDraftStateAndFile } from "../../../types";

export type ImageDraftStateAndFileError = "NoFilesProvidedError" | "NotImageError";

export type ImageDraftStateAndFileResult = Result<
  ImageDraftStateAndFile,
  ImageDraftStateAndFileError
>;

export function processImageFilesWithErrorHandling(
  files: FileList | null,
): ImageDraftStateAndFileResult[] {
  const result: ImageDraftStateAndFileResult[] = [];

  if (files == null || files.length === 0) {
    result.push(err({ reason: "NoFilesProvidedError" }));
    return result;
  }

  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) {
      result.push(err({ reason: "NotImageError" }));
      continue;
    }

    const imageDraft: ImageDraftState = {
      name: file.name,
      type: file.type,
      createdAt: Date.now(),
      breakpoints: [],
    };

    result.push(ok({ imageDraft, file }));
  }

  return result;
}
