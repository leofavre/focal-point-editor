const IMAGE_AREA_RATIO = 1 / 2;

/**
 * Detects the proportional image height based on the smaller dimension of the container (width or height).
 *
 * @param aspectRatio - Optional width/height of the image. If omitted, returns `undefined`.
 * @returns The height as a percentage of the container, or `undefined` if `aspectRatio` is missing.
 */
export function detectProportionalImageHeight({ aspectRatio }: { aspectRatio?: number }) {
  if (aspectRatio == null) return;

  const containerMinSize = 100;
  const containerArea = containerMinSize ** 2;
  const imageArea = containerArea * IMAGE_AREA_RATIO;
  const height = Math.sqrt(imageArea / aspectRatio);

  return height;
}
