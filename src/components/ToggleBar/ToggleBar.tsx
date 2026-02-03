import { Wrapper } from "./ToggleBar.styled";
import type { ToggleBarProps } from "./types";

export function ToggleBar({ children, ...rest }: ToggleBarProps) {
  return (
    <Wrapper data-component="ToggleBar" {...rest}>
      {children}
    </Wrapper>
  );
}
