import type { RefObject, SyntheticEvent } from "react";
import type { ObjectPositionString, StyleProps } from "../../types";

export type Coordinates = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type ImageObserved = {
  deltaWidthPx: number;
  deltaHeightPx: number;
  deltaWidthPercent: number;
  deltaHeightPercent: number;
  changedDimension: "width" | "height" | undefined;
};

export type FocusPointEditorProps = StyleProps & {
  ref: RefObject<HTMLImageElement | null>;
  imageUrl: string;
  aspectRatio?: number;
  naturalAspectRatio?: number;
  objectPosition: ObjectPositionString;
  onObjectPositionChange: (objectPosition: ObjectPositionString) => void;
  onImageLoad: (event: SyntheticEvent<HTMLImageElement>) => void;
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
};
