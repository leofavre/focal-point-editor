import type { MouseEvent } from "react";
import { useCallback, useEffectEvent } from "react";
import { Button } from "./ToggleButton.styled";
import type { ToggleButtonProps } from "./types";

export function ToggleButton({
  toggled,
  onToggle,
  onClick,
  onFocus,
  onBlur,
  titleOn,
  titleOff,
  icon,
  ref,
  type,
  scale,
  ...rest
}: ToggleButtonProps) {
  const label = toggled ? titleOn : titleOff;

  const stableOnClick = useEffectEvent((event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
  });

  const stableOnToggle = useEffectEvent((toggled: boolean) => {
    onToggle?.(toggled);
  });

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      stableOnClick(event);
      stableOnToggle(toggled);
    },
    [toggled],
  );

  return (
    <div {...rest}>
      <Button
        ref={ref}
        as="button"
        type={type}
        aria-pressed={toggled}
        onClick={handleClick}
        onFocus={onFocus}
        onBlur={onBlur}
        data-scale={scale}
      >
        {icon}
        <span>{label}</span>
      </Button>
    </div>
  );
}
