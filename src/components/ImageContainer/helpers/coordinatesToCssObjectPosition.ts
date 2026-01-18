import type { Coordinates } from "../types";

function roundWithTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function coordinatesToCssObjectPosition({ x, y }: Coordinates): string {
  const clampedX = roundWithTwoDecimals(Math.max(0, Math.min(x, 100)));
  const clampedY = roundWithTwoDecimals(Math.max(0, Math.min(y, 100)));

  return `${clampedX}% ${clampedY}%`;
}
