import type { RefObject } from "react";
import type { ImageDraftState } from "../../types";

export type ImageUploaderProps = {
  ref?: RefObject<HTMLInputElement | null>;
  onImageUpload?: (imageDraftState: ImageDraftState | null, file: File | null) => void;
};
