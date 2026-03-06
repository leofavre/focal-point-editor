import { ErrorCode } from "react-dropzone";

/** Custom error when single-image mode is enforced but user selected multiple files. */
export const SINGLE_IMAGE_REQUIRED = "single-image-required" as const;

/** Custom error when no files were provided (e.g. empty drop, multiple-file mode). */
export const NO_FILES_PROVIDED = "NoFilesProvidedError" as const;

/** Custom error when no file was provided (e.g. empty drop, single-file mode). */
export const NO_FILE_PROVIDED = "NoFileProvidedError" as const;

/** Custom error when file is not an image (from processImageFilesWithErrorHandling). */
export const NOT_IMAGE = "NotImageError" as const;

/** Custom error when the browser cannot decode the image format (e.g. HEIC in Chrome). */
export const IMAGE_FORMAT_NOT_SUPPORTED = "ImageFormatNotSupportedError" as const;

export type UploadErrorCode =
  | ErrorCode
  | typeof SINGLE_IMAGE_REQUIRED
  | typeof NO_FILES_PROVIDED
  | typeof NO_FILE_PROVIDED
  | typeof NOT_IMAGE
  | typeof IMAGE_FORMAT_NOT_SUPPORTED;

/**
 * Maps upload rejection codes to user-facing messages.
 * Used when showing toast.error for invalid or rejected uploads.
 */
export function getUploadErrorMessage(error: { reason: UploadErrorCode }): string {
  const reason = error.reason;

  switch (reason) {
    case NO_FILES_PROVIDED:
      return "Please select at least one image.";

    case NO_FILE_PROVIDED:
      return "Please select an image.";

    case ErrorCode.FileInvalidType:
    case NOT_IMAGE:
      return "The selected file is not an image.";

    case ErrorCode.FileTooLarge:
      return "The image is too large.";

    case ErrorCode.FileTooSmall:
      return "The image is too small.";

    case ErrorCode.TooManyFiles:
      return "Too many files selected.";

    case SINGLE_IMAGE_REQUIRED:
      return "Please select only one image.";

    case IMAGE_FORMAT_NOT_SUPPORTED:
      return "This image can't be displayed. It may be corrupted or in an unsupported format.";

    default:
      void (reason satisfies never);
      return "The image couldn't be processed. Please try again.";
  }
}