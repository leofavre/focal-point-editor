import type { HTMLProps, ReactNode, RefObject } from "react";

export type ToggleButtonProps = {
  ref?: RefObject<HTMLButtonElement | null>;
  type: "button" | "submit";
  toggled: boolean;
  onToggle?: (toggled: boolean) => void;
  titleOn: string;
  titleOff: string;
  icon: ReactNode;
} & Pick<HTMLProps<HTMLButtonElement>, "onClick" | "onFocus" | "onBlur">;
