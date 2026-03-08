/**
 * Central list of error reason types. Use these types for type-safe reject() / resultFromPromise;
 * pass string literals (e.g. "RefreshFailed") that match the types.
 */

/** Image upload validation (file input / drop zone). */
export type NoFilesProvidedReason = "NoFilesProvidedError";
export type NoFileProvidedReason = "NoFileProvidedError";
export type NotImageReason = "NotImageError";
export type ImageFormatNotSupportedReason = "ImageFormatNotSupportedError";

export type ImageUploadValidationReason =
  | NoFilesProvidedReason
  | NoFileProvidedReason
  | NotImageReason
  | ImageFormatNotSupportedReason;

/** Image load / create-image-state flows. */
export type ImageLoadFailedReason = "ImageLoadFailed";
export type BlobCreateFailedReason = "BlobCreateFailed";
export type InvalidUrlReason = "InvalidUrl";

export type CreateImageStateReason =
  | ImageLoadFailedReason
  | BlobCreateFailedReason
  | InvalidUrlReason;

/** Persistence (IndexedDB / images). */
export type RefreshFailedReason = "RefreshFailed";
export type AddImageFailedReason = "AddImageFailed";
export type UpdateImageFailedReason = "UpdateImageFailed";

/** Session storage. */
export type SessionStorageUnavailableReason = "SessionStorageUnavailable";

/** IndexedDB. */
export type IndexedDBUnavailableReason = "IndexedDBUnavailable";
