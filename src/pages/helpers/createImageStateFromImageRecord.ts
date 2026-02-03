import type { ImageRecord, ImageState } from "../../types";
import { getNaturalAspectRatioFromImageSrc } from "./getNaturalAspectRatioFromImageSrc";

/**
 * Converts an {@link ImageRecord} from persistent storage into an {@link ImageState}
 * suitable for rendering in the UI.
 *
 * Creates a blob URL from the record's file, loads the image to compute its natural
 * aspect ratio, then returns a complete image state. If any step fails, the blob URL
 * is revoked (if it was created) and the error is rethrown.
 *
 * @returns A promise that resolves with the full image state.
 * @throws Rethrows any error from blob URL creation or image loading. The blob URL is
 * revoked before rethrowing if it was created.
 */
export async function createImageStateFromImageRecord(
  imageRecord: ImageRecord,
): Promise<ImageState> {
  let blobUrl: string | undefined;

  try {
    blobUrl = URL.createObjectURL(imageRecord.file);
    const naturalAspectRatio = await getNaturalAspectRatioFromImageSrc(blobUrl);

    return {
      name: imageRecord.name,
      url: blobUrl,
      type: imageRecord.type,
      createdAt: imageRecord.createdAt,
      naturalAspectRatio: naturalAspectRatio,
      breakpoints: imageRecord.breakpoints,
    };
  } catch (error) {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
    }

    throw error;
  }
}
