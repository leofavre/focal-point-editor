import type { CreateImageStateReason } from "../../errorTypes";
import type { Result } from "../../helpers/errorHandling";
import { accept, reject } from "../../helpers/errorHandling";
import type { ImageDraftStateAndFile, ImageState } from "../../types";
import { getNaturalAspectRatioFromImageSrc } from "./getNaturalAspectRatioFromImageSrc";

/**
 * Builds {@link ImageState} (blob URL + natural aspect ratio) from {@link ImageDraftStateAndFile}
 * without any persistence. Use this to show the editor immediately after upload, before or without
 * saving to IndexedDB.
 *
 * @returns A promise that resolves with Result: accepted ImageState or rejected with BlobCreateFailed or ImageLoadFailed.
 */
export async function createImageStateFromDraftAndFile(
  draftAndFile: ImageDraftStateAndFile,
): Promise<Result<ImageState, CreateImageStateReason>> {
  const { imageDraft, file } = draftAndFile;
  let blobUrl: string | undefined;

  try {
    blobUrl = URL.createObjectURL(file);
  } catch {
    return reject({ reason: "BlobCreateFailed" });
  }

  const ratioResult = await getNaturalAspectRatioFromImageSrc(blobUrl);

  /**
   * @todo Maybe show error to the user in the UI.
   */
  if (ratioResult.rejected != null) {
    URL.revokeObjectURL(blobUrl);
    return reject({ reason: ratioResult.rejected.reason });
  }

  return accept({
    ...imageDraft,
    url: blobUrl,
    naturalAspectRatio: ratioResult.accepted,
  });
}
