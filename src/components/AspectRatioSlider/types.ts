import type { Ref } from "react";

export type AspectRatio = {
  name: string;
  value: number;
  position: number;
};

export type AspectRatioSliderProps = {
  ref?: Ref<HTMLInputElement>;
  aspectRatio?: number;
  defaultAspectRatio?: number;
  onAspectRatioChange?: (aspectRatio: number) => void;
};
