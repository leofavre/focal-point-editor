import type { RefObject } from "react";
import type { ImageDraftStateAndFile } from "../../types";

type SingleImageUploaderProps = {
  ref?: RefObject<HTMLInputElement | null>;
  onImagesUpload?: never;
  onImageUpload: (draftAndFile: ImageDraftStateAndFile | undefined) => void;
};

type MultipleImagesUploaderProps = {
  ref?: RefObject<HTMLInputElement | null>;
  onImageUpload?: never;
  onImagesUpload: (draftsAndFiles: ImageDraftStateAndFile[]) => void;
};

export type ImageUploaderProps = SingleImageUploaderProps | MultipleImagesUploaderProps;
