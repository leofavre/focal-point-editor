import type { ReactNode, RefObject } from "react";

export type ToggleBarProps = {
  ref?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
};
