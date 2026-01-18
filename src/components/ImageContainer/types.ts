import type { RefObject, SyntheticEvent } from "react";
import type { StyleProps } from "../../types";

export type Coordinates = {
  x: number;
  y: number;
};

export type ImageObserved = {
  deltaWidth: number;
  deltaHeight: number;
  movementAxis: "horizontal" | "vertical" | undefined;
};

export type ImageContainerProps = StyleProps & {
  ref: RefObject<HTMLImageElement | null>;
  aspectRatio?: number;
  imageUrl: string;
  onImageLoad: (event: SyntheticEvent<HTMLImageElement>) => void;
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
};
