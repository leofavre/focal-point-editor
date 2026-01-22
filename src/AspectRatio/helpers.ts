import { ASPECT_RATIO_PRECISION } from "./constants";

export function toPreciseAspectRatio(aspectRatio: number) {
  return Math.round(aspectRatio * ASPECT_RATIO_PRECISION);
}

export function toAspectRatio(preciseAspectRatio: number) {
  return preciseAspectRatio / ASPECT_RATIO_PRECISION;
}
