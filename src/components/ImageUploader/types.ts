import type { PropsWithChildren, RefObject } from "react";
import type { ImageDraftStateAndFile } from "../../types";

type SingleImageUploaderProps = {
  onImagesUpload?: never;
  onImageUpload: (draftAndFile: ImageDraftStateAndFile | undefined) => void;
};

type MultipleImagesUploaderProps = {
  onImageUpload?: never;
  onImagesUpload: (draftsAndFiles: ImageDraftStateAndFile[]) => void;
};

export type ImageUploaderProps = PropsWithChildren<
  (SingleImageUploaderProps | MultipleImagesUploaderProps) & {
    ref?: RefObject<HTMLInputElement | null>;
  }
>;
