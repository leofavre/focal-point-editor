import type { RefObject } from "react";
import type { AspectRatio } from "../types";

export type AspectRatioSliderProps = {
  ref?: RefObject<HTMLInputElement | null>;
  aspectRatio: number;
  aspectRatioList: AspectRatio[];
  onAspectRatioChange?: (aspectRatio: number) => void;
};
