import { type MouseEvent, useCallback, useEffectEvent } from "react";
import { SmallButton } from "../SmallButton";
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
    <SmallButton
      ref={ref}
      as="button"
      type={type}
      title={label}
      aria-pressed={toggled}
      onClick={handleClick}
      onFocus={onFocus}
      onBlur={onBlur}
      {...rest}
    >
      {icon}
      <span>{label}</span>
    </SmallButton>
  );
}
