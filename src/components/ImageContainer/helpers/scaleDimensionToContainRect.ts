import type { Dimensions } from "../types";

export function scaleDimensionsToContainRect({
  source,
  rect,
}: {
  source: Dimensions;
  rect: Dimensions;
}) {
  const sourceAspectRatio = source.width / source.height;
  const rectAspectRatio = rect.width / rect.height;

  let nextWidth = rect.width;
  let nextHeight = rect.height;

  if (sourceAspectRatio > rectAspectRatio) {
    nextWidth = (rect.height * source.width) / source.height;
  } else {
    nextHeight = (rect.width * source.height) / source.width;
  }

  return {
    width: nextWidth,
    height: nextHeight,
  };
}
