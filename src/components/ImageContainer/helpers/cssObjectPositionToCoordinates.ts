import type { Coordinates } from "../types";

export function cssObjectPositionToCoordinates(string: string): Coordinates {
  const [x, y] = string.split(" ");

  return {
    x: Number(x.replace("%", "")),
    y: Number(y.replace("%", "")),
  };
}
