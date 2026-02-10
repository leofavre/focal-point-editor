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
 * | persistent  | no                 | yes   | Landing (impossible state)            |
 * | persistent  | yes                | yes   | Editing                               |
 */
export function usePageState({
  persistenceMode,
  imageId,
  image,
}: {
  persistenceMode: UIPersistenceMode;
  imageId: ImageId | undefined;
  image: ImageState | null;
}): UIPageState {
  if (persistenceMode === "ephemeral") {
    if (imageId != null) return "pageNotFound";
    if (image != null) return "editing";
    return "landing";
  }

  if (imageId == null) return "landing";
  if (image == null) return "imageNotFound";
  return "editing";
}
