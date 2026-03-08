import type { CreateImageStateReason } from "../../errorTypes";
import type { Result } from "../../helpers/errorHandling";
import type { ImageRecordWithFile, ImageState } from "../../types";
import { createImageStateFromDraftAndFile } from "./createImageStateFromDraftAndFile";

/**
 * Converts a file-based {@link ImageRecordWithFile} from persistent storage into an
 * {@link ImageState} suitable for rendering in the UI.
 *
 * Creates a blob URL from the record's file, loads the image to compute its natural
 * aspect ratio, then returns a complete image state. If any step fails, the blob URL
 * is revoked (if it was created) and a rejected Result is returned.
 *
 * Callers must pass only file-based records; for url-based records use createImageStateFromUrl.
 *
 * @returns A promise that resolves with Result: accepted ImageState or rejected with BlobCreateFailed or ImageLoadFailed.
 */
export async function createImageStateFromRecord(
  imageRecord: ImageRecordWithFile,
): Promise<Result<ImageState, CreateImageStateReason>> {
  const { id: _id, file, ...imageDraft } = imageRecord;
  return createImageStateFromDraftAndFile({ imageDraft, file });
}
