import type { ImageDimensionDelta } from "../types";
import { scaleDimensionsToContainRect } from "./scaleDimensionToContainRect";
import { toPercentage } from "./toPercentage";

/** Minimum pixel difference in a dimension to consider it the "changed" dimension. */
const DELTA_DIMENSION_THRESHOLD_PX = 1;

/**
 * Computes the difference between an image’s natural size and the size it would
 * have when scaled with `object-fit: contain` inside its current bounding rect.
 *
 * Used to detect whether the image is constrained by width or height in its
 * container, so the focus-point editor can map pointer movement to the correct
 * axis (e.g. horizontal drag when width is constrained).
 *
 * @returns An {@link ImageDimensionDelta} with width/height deltas in px and %,
 * and `changedDimension` set to the constrained axis (`width` or `height`),
 * or `null` if the element is missing.
 */
export function getImageDimensionDelta(
  imgElement: HTMLImageElement | null,
): ImageDimensionDelta | null {
  if (imgElement == null) return null;

  const source = {
    width: imgElement.naturalWidth,
    height: imgElement.naturalHeight,
  };

  const rect = imgElement.getBoundingClientRect();

  const { width, height } = scaleDimensionsToContainRect({ source, rect });
  const deltaWidthPx = width - rect.width;
  const deltaHeightPx = height - rect.height;
  const deltaWidthPercent = toPercentage(deltaWidthPx, width);
  const deltaHeightPercent = toPercentage(deltaHeightPx, height);

  const changedDimension =
    deltaWidthPx > DELTA_DIMENSION_THRESHOLD_PX
      ? "width"
      : deltaHeightPx > DELTA_DIMENSION_THRESHOLD_PX
        ? "height"
        : undefined;

  return {
    width: { px: deltaWidthPx, percent: deltaWidthPercent },
    height: { px: deltaHeightPx, percent: deltaHeightPercent },
    changedDimension,
  };
}
