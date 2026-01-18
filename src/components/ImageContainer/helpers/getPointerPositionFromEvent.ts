import type { Coordinates } from "../types";

export function getPointerCoordinatesFromEvent({
  event: { clientX, clientY },
}: {
  event: { clientX: number; clientY: number };
}): Coordinates {
  return { x: clientX, y: clientY };
}
