import { ErrorCode } from "react-dropzone";

/** Custom error when single-image mode is enforced but user selected multiple files. */
export const SINGLE_IMAGE_REQUIRED = "single-image-required" as const;

/** Custom error when no files were provided (e.g. empty drop, multiple-file mode). */
export const NO_FILES_PROVIDED = "NoFilesProvidedError" as const;

/** Custom error when no file was provided (e.g. empty drop, single-file mode). */
export const NO_FILE_PROVIDED = "NoFileProvidedError" as const;

/** Custom error when file is not an image (from processImageFilesWithErrorHandling). */
export const NOT_IMAGE = "NotImageError" as const;

export type UploadErrorCode =
  | ErrorCode
  | typeof SINGLE_IMAGE_REQUIRED
  | typeof NO_FILES_PROVIDED
  | typeof NO_FILE_PROVIDED
  | typeof NOT_IMAGE;

/**
 * Maps upload rejection codes to user-facing messages.
 * Used when showing toast.error for invalid or rejected uploads.
 */
export function getUploadErrorMessage(error: { reason: UploadErrorCode }): string {
  const reason = error.reason;

  switch (reason) {
    case NO_FILES_PROVIDED:
      return "No files provided";
    case NO_FILE_PROVIDED:
      return "No file provided";
    case ErrorCode.FileInvalidType:
      return "Only image files are allowed";
    case ErrorCode.FileTooLarge:
      return "File is too large";
    case ErrorCode.FileTooSmall:
      return "File is too small";
    case ErrorCode.TooManyFiles:
      return "Too many files";
    case SINGLE_IMAGE_REQUIRED:
      return "Only a single image is allowed";
    case NOT_IMAGE:
      return "File is not an image";
    default:
      void (reason satisfies never);
      return "File could not be uploaded";
  }
}
