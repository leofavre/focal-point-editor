import type { RefObject } from "react";
import type { ImageDraftStateAndFile } from "../../types";

export type ImageUploaderProps = {
  ref?: RefObject<HTMLInputElement | null>;
  onImageUpload?: (event: ImageDraftStateAndFile[]) => void;
};
