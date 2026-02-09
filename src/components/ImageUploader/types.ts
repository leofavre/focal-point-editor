import type { Ref } from "react";
import type { ImageDraftStateAndFile } from "../../types";

type SingleImageUploaderProps = {
  onImagesUpload?: never;
  onImageUpload: (draftAndFile: ImageDraftStateAndFile | undefined) => void;
};

type MultipleImagesUploaderProps = {
  onImageUpload?: never;
  onImagesUpload: (draftsAndFiles: ImageDraftStateAndFile[]) => void;
};

export type ImageUploaderProps = SingleImageUploaderProps | MultipleImagesUploaderProps;

export type ImageUploaderButtonProps = ImageUploaderProps & {
  ref?: Ref<HTMLButtonElement>;
  size?: "small" | "medium" | "large";
};

export type FullScreenDropZoneProps = Pick<ImageUploaderProps, "onImageUpload" | "onImagesUpload">;
