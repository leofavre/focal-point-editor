import type { ChangeEvent, ComponentPropsWithoutRef } from "react";

export type LabeledCheckboxProps = {
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  disabled?: boolean;
} & Omit<ComponentPropsWithoutRef<"input">, "type" | "checked" | "onChange">;
