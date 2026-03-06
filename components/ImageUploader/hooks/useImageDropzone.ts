import { useCallback, useEffectEvent } from "react";
import { type ErrorCode, type FileRejection, useDropzone } from "react-dropzone";
import type { Err } from "@/src/helpers/errorHandling";
import type { ImageDraftState, ImageDraftStateAndFile } from "@/src/types";
import {
  NO_FILE_PROVIDED,
  NO_FILES_PROVIDED,
  SINGLE_IMAGE_REQUIRED,
  type UploadErrorCode,
} from "../getUploadErrorMessage";
import type { ImageUploaderProps } from "../types";

const IMAGE_ACCEPT = {
  "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"],
} as const;

export type UseImageDropzoneOptions = Pick<
  ImageUploaderProps,
  "onImageUpload" | "onImagesUpload" | "onImageUploadError" | "onImagesUploadError"
> & {
  /** Disable click to open file dialog (e.g. full-screen drag-only zone). */
  noClick?: boolean;
  /** Disable drag and drop (e.g. button that only opens file dialog). */
  noDrag?: boolean;
  /** Allow multiple files. When false, rejects when user selects more than one image. */
  multiple?: boolean;
  /** Called when the file dialog is closed without selection. */
  onFileDialogCancel?: () => void;
  /** Called when files are accepted (e.g. to close a file-picker UI). */
  onDropAccepted?: () => void;
};

function filesToDraftsAndFiles(acceptedFiles: File[]): ImageDraftStateAndFile[] {
  return acceptedFiles.map((file) => {
    const imageDraft: ImageDraftState = {
      name: file.name,
      type: file.type,
      createdAt: Date.now(),
      breakpoints: [],
    };
    return { imageDraft, file };
  });
}

/**
 * Map react-dropzone rejections to app error shape.
 * @todo Maybe add more rejections per file if we want to show more
 * information to the user in the UI. For now, keeping this simple.
 */
function fileRejectionsToErrors(fileRejections: FileRejection[]): Err<ErrorCode>[] {
  return fileRejections.map((rejection) => ({
    reason: rejection.errors[0].code as ErrorCode,
  }));
}

/**
 * Shared react-dropzone setup for image upload: same accept list and mapping from
 * accepted/rejected files to app callbacks (ImageDraftStateAndFile, Err<ErrorCode>).
 * Use noClick + drag for full-screen drop zone; noDrag + click for button.
 */
export function useImageDropzone({
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
  noClick = false,
  noDrag = false,
  multiple = true,
  onFileDialogCancel,
  onDropAccepted,
}: UseImageDropzoneOptions) {
  const stableOnImageUpload = useEffectEvent((draftAndFile: ImageDraftStateAndFile) =>
    onImageUpload?.(draftAndFile),
  );
  const stableOnImagesUpload = useEffectEvent((draftsAndFiles: ImageDraftStateAndFile[]) =>
    onImagesUpload?.(draftsAndFiles),
  );
  const stableOnImageUploadError = useEffectEvent((error: Err<UploadErrorCode>) =>
    onImageUploadError?.(error),
  );
  const stableOnImagesUploadError = useEffectEvent((errors: Err<ErrorCode>[]) =>
    onImagesUploadError?.(errors),
  );
  const stableOnDropAccepted = useEffectEvent(() => onDropAccepted?.());

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const totalFiles = acceptedFiles.length + fileRejections.length;

      if (totalFiles === 0) {
        stableOnImageUploadError({
          reason: multiple ? NO_FILES_PROVIDED : NO_FILE_PROVIDED,
        });
        return;
      }

      if (!multiple && totalFiles > 1) {
        stableOnImageUploadError({ reason: SINGLE_IMAGE_REQUIRED });
        return;
      }

      const accepted = filesToDraftsAndFiles(acceptedFiles);
      const rejected = fileRejectionsToErrors(fileRejections);

      if (accepted.length > 0) {
        stableOnImageUpload(accepted[0]);
        stableOnImagesUpload(accepted);
        stableOnDropAccepted();
      }

      if (rejected.length > 0) {
        stableOnImageUploadError(rejected[0]);
        stableOnImagesUploadError(rejected);
      }
    },
    [multiple],
  );

  return useDropzone({
    accept: IMAGE_ACCEPT,
    onDrop,
    noClick,
    noDrag,
    noKeyboard: noClick,
    multiple,
    onFileDialogCancel,
  });
}
