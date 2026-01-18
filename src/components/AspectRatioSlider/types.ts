import type { RefObject } from "react";
import type { StyleProps } from "../../types";

export type AspectRatioName =
  | "ultrawide"
  | "wide"
  | "photoLandscape"
  | "classicLandscape"
  | "print"
  | "square"
  | "social"
  | "classicPortrait"
  | "photoPortrait"
  | "vertical";

export type AspectRatio = {
  name: AspectRatioName;
  value: number;
  preciseValue: number;
};

export type AspectRatioSliderProps = StyleProps & {
  ref?: RefObject<HTMLInputElement | null>;
  aspectRatio?: number;
  onAspectRatioChange?: (aspectRatio: number) => void;
};
