import type { PropsWithChildren, RefObject } from "react";
import type { ImageDraftStateAndFile } from "../../types";

type SingleImageUploaderProps = {
  onImagesUpload?: never;
  onImageUpload: (draftAndFile: ImageDraftStateAndFile | undefined) => Promise<void>;
};

type MultipleImagesUploaderProps = {
  onImageUpload?: never;
  onImagesUpload: (draftsAndFiles: ImageDraftStateAndFile[]) => Promise<void>;
};

export type ImageUploaderProps = PropsWithChildren<
  (SingleImageUploaderProps | MultipleImagesUploaderProps) & {
    ref?: RefObject<HTMLInputElement | null>;
  }
>;

export type ImageUploaderButtonProps = (SingleImageUploaderProps | MultipleImagesUploaderProps) & {
  ref?: RefObject<HTMLButtonElement | null>;
};
