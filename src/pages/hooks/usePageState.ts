import type { ImageId, ImageState, UIPageState, UIPersistenceMode } from "../../types";

/**
 * | persistence | imageId (from url) | image | State                                 |
 * |:------------|:-------------------|:------|:--------------------------------------|
 * | persistent  | no                 | no    | Landing                               |
 * | persistent  | yes                | no    | Image not found (can also be loading) |
 * | persistent  | no                 | yes   | Landing                               |
 * | persistent  | yes                | yes   | Editing                               |
 */
export function usePageState({
  persistenceMode,
  imageId,
  image,
  isEditingSingleImage,
}: {
  persistenceMode: UIPersistenceMode;
  imageId: ImageId | undefined;
  image: ImageState | null;
  isEditingSingleImage: boolean;
}): UIPageState {
  if (imageId == null) return "landing";
  if (image == null)
    return persistenceMode === "singleImage" && isEditingSingleImage
      ? "imageNotFound"
      : "pageNotFound";
  return "editing";
}
