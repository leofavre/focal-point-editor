import type { ObjectPositionString } from "../types";

export const IMAGE_AREA_RATIO = 1 / 2;

export const CURSOR_MAP = {
  width: "col-resize",
  height: "row-resize",
} as const;

export const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";
