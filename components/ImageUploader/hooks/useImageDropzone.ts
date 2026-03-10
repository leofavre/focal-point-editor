import { useCallback, useEffectEvent } from "react";
import { type ErrorCode, type FileRejection, useDropzone } from "react-dropzone";
import type { Err } from "@/src/helpers/errorHandling";
import type { ImageDraftState, ImageDraftStateAndFile } from "@/src/types";
import {
  IMAGE_FORMAT_NOT_SUPPORTED,
  NO_FILE_PROVIDED,
  NO_FILES_PROVIDED,
  NOT_IMAGE,
  SINGLE_IMAGE_REQUIRED,
  type UploadErrorCode,
} from "../getUploadErrorMessage";
import { canBrowserDecodeImage } from "../helpers/canBrowserDecodeImage";
import type { ImageUploaderProps } from "../types";

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

  const stableOnImagesUploadError = useEffectEvent((errors: Err<UploadErrorCode>[]) =>
    onImagesUploadError?.(errors),
  );

  const stableOnDropAccepted = useEffectEvent(() => onDropAccepted?.());

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
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

      const rejected = fileRejectionsToErrors(fileRejections);

      const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));
      const nonImageFiles = acceptedFiles.filter((file) => !file.type.startsWith("image/"));

      const notImageErrors: Err<UploadErrorCode>[] = nonImageFiles.map(() => ({
        reason: NOT_IMAGE,
      }));

      if (imageFiles.length === 0) {
        const allErrors = [...rejected, ...notImageErrors];

        if (allErrors.length > 0) {
          stableOnImageUploadError(allErrors[0]);
          stableOnImagesUploadError(allErrors);
        }

        return;
      }

      const decodeResults = await Promise.all(
        imageFiles.map(async (file) => ({
          file,
          supported: await canBrowserDecodeImage(file),
        })),
      );

      const supportedFiles = decodeResults.filter((r) => r.supported).map((r) => r.file);

      const formatErrors: Err<UploadErrorCode>[] = decodeResults
        .filter((r) => !r.supported)
        .map(() => ({ reason: IMAGE_FORMAT_NOT_SUPPORTED }));

      const allErrors = [...rejected, ...notImageErrors, ...formatErrors];

      if (allErrors.length > 0) {
        stableOnImageUploadError(allErrors[0]);
        stableOnImagesUploadError(allErrors);
      }

      if (supportedFiles.length > 0) {
        const accepted = filesToDraftsAndFiles(supportedFiles);
        stableOnImageUpload(accepted[0]);
        stableOnImagesUpload(accepted);
        stableOnDropAccepted();
      }
    },
    [multiple],
  );

  return useDropzone({
    onDrop,
    noClick,
    noDrag,
    noKeyboard: noClick,
    multiple,
    onFileDialogCancel,
  });
}
