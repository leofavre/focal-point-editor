import type { HTMLProps, ReactNode, Ref } from "react";

type ButtonToggleableProps = {
  toggleable: true;
  toggled: boolean;
  onToggle?: (toggled: boolean) => void;
};

type ButtonNonToggleableProps = {
  toggleable?: false;
  toggled?: never;
  onToggle?: never;
};

export type ButtonProps = (ButtonToggleableProps | ButtonNonToggleableProps) & {
  ref?: Ref<HTMLButtonElement>;
  type: "button" | "submit";
  scale?: number;
  disabled?: boolean;
  children?: ReactNode;
  colorScheme?: "foreground" | "background";
  grow?: boolean;
} & Pick<HTMLProps<HTMLButtonElement>, "aria-label" | "onClick" | "onFocus" | "onBlur">;
