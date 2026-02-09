import type { CreateImageStateReason } from "../../errorTypes";
import type { Result } from "../../helpers/errorHandling";
import { accept, reject } from "../../helpers/errorHandling";
import type { ImageRecord, ImageState } from "../../types";
import { getNaturalAspectRatioFromImageSrc } from "./getNaturalAspectRatioFromImageSrc";

/**
 * Converts an {@link ImageRecord} from persistent storage into an {@link ImageState}
 * suitable for rendering in the UI.
 *
 * Creates a blob URL from the record's file, loads the image to compute its natural
 * aspect ratio, then returns a complete image state. If any step fails, the blob URL
 * is revoked (if it was created) and a rejected Result is returned.
 *
 * @returns A promise that resolves with Result: accepted ImageState or rejected with BlobCreateFailed or ImageLoadFailed.
 */
export async function createImageStateFromImageRecord(
  imageRecord: ImageRecord,
): Promise<Result<ImageState, CreateImageStateReason>> {
  let blobUrl: string | undefined;

  try {
    blobUrl = URL.createObjectURL(imageRecord.file);
  } catch {
    return reject({ reason: "BlobCreateFailed" });
  }

  const ratioResult = await getNaturalAspectRatioFromImageSrc(blobUrl);

  if (ratioResult.rejected != null) {
    URL.revokeObjectURL(blobUrl);
    return reject({ reason: ratioResult.rejected.reason });
  }

  return accept({
    name: imageRecord.name,
    url: blobUrl,
    type: imageRecord.type,
    createdAt: imageRecord.createdAt,
    naturalAspectRatio: ratioResult.accepted,
    breakpoints: imageRecord.breakpoints,
  });
}
