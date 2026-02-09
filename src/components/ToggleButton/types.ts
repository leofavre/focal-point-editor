import type { HTMLProps, ReactNode, Ref } from "react";

export type ToggleButtonProps = {
  ref?: Ref<HTMLButtonElement>;
  type: "button" | "submit";
  toggled: boolean;
  onToggle?: (toggled: boolean) => void;
  titleOn: string;
  titleOff: string;
  icon: ReactNode;
  scale?: number;
} & Pick<HTMLProps<HTMLButtonElement>, "onClick" | "onFocus" | "onBlur">;
