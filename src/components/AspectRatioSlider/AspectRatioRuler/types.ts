import type { RefObject } from "react";
import type { AspectRatio } from "../types";

export type AspectRatioRulerProps = {
  ref?: RefObject<HTMLUListElement | null>;
  aspectRatioList: AspectRatio[];
};
