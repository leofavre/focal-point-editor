import { toPreciseAspectRatio } from "./helpers";
import type { AspectRatio, AspectRatioName } from "./types";

export const ASPECT_RATIO_MAP: Record<AspectRatioName, number> = {
  ultrawide: 21 / 9,
  wide: 16 / 9,
  photoLandscape: 3 / 2,
  classicLandscape: 4 / 3,
  print: 5 / 4,
  square: 1 / 1,
  social: 4 / 5,
  classicPortrait: 3 / 4,
  photoPortrait: 2 / 3,
  vertical: 9 / 16,
};

export const ASPECT_RATIO: AspectRatio[] = Object.entries(ASPECT_RATIO_MAP)
  .map(([key, value]) => ({
    name: key as AspectRatioName,
    value,
    preciseValue: toPreciseAspectRatio(value),
  }))
  .sort((a, b) => a.preciseValue - b.preciseValue);
