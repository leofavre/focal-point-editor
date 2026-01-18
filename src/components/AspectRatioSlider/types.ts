import type { RefObject } from "react";
import type { StyleProps } from "../../types";

export type AspectRatio = {
  name: string;
  value: number;
  preciseValue: number;
};

export type AspectRatioSliderProps = StyleProps & {
  ref?: RefObject<HTMLInputElement | null>;
  aspectRatio: number;
  onAspectRatioChange?: (aspectRatio: number) => void;
};
