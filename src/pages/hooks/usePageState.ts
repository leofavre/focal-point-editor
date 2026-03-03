import type { ImageId, ImageState, UIPageState, UIPersistenceMode } from "../../types";

/**
 * | pathname (route)    | persistence | imageId (from url) | image | State                                 |
 * |:--------------------|:------------|:-------------------|:------|:--------------------------------------|
 * | /privacy            | -           | -                  | -     | Privacy                               |
 * | unmatched (*)       | -           | -                  | -     | Page not found                        |
 * | /                   | persistent  | no                 | no    | Landing                               |
 * | /image/:id          | persistent  | yes                | no    | Image not found (can also be loading) |
 * | /                   | persistent  | no                 | yes   | Landing                               |
 * | /image/:id          | persistent  | yes                | yes   | Editing                               |
 */
export function usePageState({
  pathname,
  persistenceMode,
  imageId,
  image,
  isEditingSingleImage,
}: {
  pathname: string;
  persistenceMode: UIPersistenceMode;
  imageId: ImageId | undefined;
  image: ImageState | null;
  isEditingSingleImage: boolean;
}): UIPageState {
  if (pathname === "/privacy") return "privacy";

  const isPageNotFoundRoute = pathname !== "/" && !/^\/image\/[^/]+$/.test(pathname);
  if (isPageNotFoundRoute) return "pageNotFound";

  if (imageId == null) return "landing";

  if (image == null)
    return persistenceMode === "singleImage" && isEditingSingleImage
      ? "imageNotFound"
      : "pageNotFound";

  return "editing";
}
