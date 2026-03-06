import type { CreateImageStateReason } from "../../errorTypes";
import type { Result } from "../../helpers/errorHandling";
import { accept, reject } from "../../helpers/errorHandling";
import type { ImageDraftStateAndUrl, ImageState } from "../../types";
import { getNaturalAspectRatioFromImageSrc } from "./getNaturalAspectRatioFromImageSrc";

const ALLOWED_PROTOCOLS = ["http:", "https:"];

function isUrlValid(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    return ALLOWED_PROTOCOLS.includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Builds {@link ImageState} (url + natural aspect ratio) from {@link ImageDraftStateAndUrl}
 * without any blob creation. Validates URL format and protocol (http/https) before loading.
 *
 * @returns A promise that resolves with Result: accepted ImageState or rejected with InvalidUrl or ImageLoadFailed.
 */
export async function createImageStateFromUrl(
  draftAndUrl: ImageDraftStateAndUrl,
): Promise<Result<ImageState, CreateImageStateReason>> {
  const { imageDraft, url } = draftAndUrl;

  if (!isUrlValid(url)) {
    return reject({ reason: "InvalidUrl" });
  }

  const ratioResult = await getNaturalAspectRatioFromImageSrc(url);

  if (ratioResult.rejected != null) {
    return reject({ reason: ratioResult.rejected.reason });
  }

  return accept({
    ...imageDraft,
    url,
    naturalAspectRatio: ratioResult.accepted,
  });
}
