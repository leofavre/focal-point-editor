import type { HTMLProps, ReactNode, Ref } from "react";

export type ToggleButtonProps = {
  ref?: Ref<HTMLButtonElement>;
  type: "button" | "submit";
  toggled: boolean;
  onToggle?: (toggled: boolean) => void;
  scale?: number;
  disabled?: boolean;
  toggleable?: boolean;
  children?: ReactNode;
} & Pick<HTMLProps<HTMLButtonElement>, "onClick" | "onFocus" | "onBlur">;
