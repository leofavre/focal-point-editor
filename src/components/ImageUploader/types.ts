import type { ComponentPropsWithoutRef, Ref } from "react";
import type { Err } from "../../helpers/errorHandling";
import type { ImageDraftStateAndFile, ImageDraftStateAndUrl } from "../../types";

export type SingleImageUploaderProps = {
  onImagesUpload?: never;
  onImagesUploadError?: never;
  onImageUpload: (draftAndFileOrUrl: ImageDraftStateAndFile | ImageDraftStateAndUrl) => void;
  onImageUploadError?: (error: Err<string>) => void;
};

export type MultipleImagesUploaderProps = {
  onImageUpload?: never;
  onImageUploadError?: never;
  onImagesUpload: (
    draftsAndFilesOrUrls: (ImageDraftStateAndFile | ImageDraftStateAndUrl)[],
  ) => void;
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
> &
  ComponentPropsWithoutRef<"div">;
