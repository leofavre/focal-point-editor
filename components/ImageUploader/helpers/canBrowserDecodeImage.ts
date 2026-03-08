/**
 * Checks whether the current browser can decode and display the given image file.
 * Uses createImageBitmap (and falls back to Image.decode()) so support is detected
 * dynamically (e.g. HEIC/HEIF not supported in Chrome, WebP/AVIF support varies).
 *
 * @param file - Image file (any image/* type)
 * @returns Promise that resolves to true if the browser can decode the image, false otherwise
 */
export function canBrowserDecodeImage(file: File): Promise<boolean> {
  if (!file.type.startsWith("image/")) {
    return Promise.resolve(false);
  }

  if (typeof createImageBitmap !== "undefined") {
    return createImageBitmap(file)
      .then((bitmap) => {
        bitmap.close();
        return true;
      })
      .catch(() => false);
  }

  return new Promise<boolean>((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      img
        .decode()
        .then(() => resolve(true))
        .catch(() => resolve(false));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    img.src = url;
  });
}
