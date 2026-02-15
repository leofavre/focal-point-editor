import type { Ref } from "react";
import type { Err } from "../../helpers/errorHandling";
import type { ImageDraftStateAndFile } from "../../types";

export type SingleImageUploaderProps = {
  onImagesUpload?: never;
  onImagesUploadError?: never;
  onImageUpload: (draftAndFile: ImageDraftStateAndFile) => void;
  onImageUploadError?: (error: Err<string>) => void;
};

export type MultipleImagesUploaderProps = {
  onImageUpload?: never;
  onImageUploadError?: never;
  onImagesUpload: (draftsAndFiles: ImageDraftStateAndFile[]) => void;
  onImagesUploadError?: (errors: Err<string>[]) => void;
};

export type ImageUploaderProps = SingleImageUploaderProps | MultipleImagesUploaderProps;

export type ImageUploaderButtonProps = ImageUploaderProps & {
  ref?: Ref<HTMLButtonElement>;
  size?: "small" | "medium" | "large";
  label: string;
};

export type FullScreenDropZoneProps = Pick<
  ImageUploaderProps,
  "onImageUpload" | "onImagesUpload" | "onImageUploadError" | "onImagesUploadError"
>;
