import { Input, Label } from "./LabeledCheckbox.styled";
import type { LabeledCheckboxProps } from "./types";

export function LabeledCheckbox({
  checked,
  onChange,
  label,
  disabled,
  ...rest
}: LabeledCheckboxProps) {
  return (
    <Label>
      <Input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} {...rest} />
      {label}
    </Label>
  );
}
