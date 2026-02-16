import type { MouseEvent } from "react";
import { useCallback, useEffectEvent } from "react";
import { parseBooleanAttr } from "../../helpers/parseBooleanAttr";
import { Button, Label, Shadow } from "./ToggleButton.styled";
import type { ToggleButtonProps } from "./types";

export function ToggleButton({
  toggled,
  onToggle,
  onClick,
  onFocus,
  onBlur,
  children,
  ref,
  type,
  scale,
  disabled,
  toggleable,
  ...rest
}: ToggleButtonProps) {
  const stableOnClick = useEffectEvent((event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
  });

  const stableOnToggle = useEffectEvent((toggled: boolean) => {
    onToggle?.(toggled);
  });

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      stableOnClick(event);
      if (toggleable) stableOnToggle(toggled);
    },
    [toggled, toggleable],
  );

  return (
    <Label {...rest}>
      <Button
        ref={ref}
        as="button"
        type={type}
        disabled={disabled}
        data-toggleable={parseBooleanAttr(toggleable ?? true)}
        aria-pressed={toggled}
        onClick={disabled ? undefined : handleClick}
        onFocus={disabled ? undefined : onFocus}
        onBlur={disabled ? undefined : onBlur}
        data-scale={scale}
      >
        {children}
      </Button>
      <Shadow />
    </Label>
  );
}
