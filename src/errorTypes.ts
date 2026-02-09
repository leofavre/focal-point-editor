/**
 * Central list of error reason types. Use these types for type-safe reject() / resultFromPromise;
 * pass string literals (e.g. "RefreshFailed") that match the types.
 */

/** Image upload validation (file input / drop zone). */
export type NoFilesProvidedReason = "NoFilesProvidedError";
export type NotImageReason = "NotImageError";
export type ImageUploadValidationReason = NoFilesProvidedReason | NotImageReason;

/** Image load / create-image-state flows. */
export type ImageLoadFailedReason = "ImageLoadFailed";
export type BlobCreateFailedReason = "BlobCreateFailed";
export type CreateImageStateReason = ImageLoadFailedReason | BlobCreateFailedReason;

/** Persistence (IndexedDB / images). */
export type RefreshFailedReason = "RefreshFailed";
export type AddImageFailedReason = "AddImageFailed";
export type UpdateImageFailedReason = "UpdateImageFailed";

/** Session storage. */
export type SessionStorageUnavailableReason = "SessionStorageUnavailable";

/** IndexedDB. */
export type IndexedDBUnavailableReason = "IndexedDBUnavailable";

/** UI record load (getRecord failure). */
export type GetUIRecordFailedReason = "GetUIRecordFailed";
