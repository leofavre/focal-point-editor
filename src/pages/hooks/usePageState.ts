import type { ImageId, ImageState, UIPageState, UIPersistenceMode } from "../../types";

/**
 * | persistence | imageId (from url) | image | State                                 |
 * |:------------|:-------------------|:------|:--------------------------------------|
 * | ephemeral   | no                 | no    | Landing                               |
 * | ephemeral   | yes                | no    | Page not found                        |
 * | ephemeral   | no                 | yes   | Editing                               |
 * | ephemeral   | yes                | yes   | Page not found                        |
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
  if (persistenceMode === "ephemeral") {
    if (imageId != null) return "pageNotFound";
    if (image != null) return "editing";
    return "landing";
  }

  if (persistenceMode === "singleImage") {
    if (imageId == null) return "landing";
    if (image == null) return isEditingSingleImage ? "imageNotFound" : "pageNotFound";
    return "editing";
  }

  if (imageId == null) return "landing";
  if (image == null) return "imageNotFound";
  return "editing";
}
