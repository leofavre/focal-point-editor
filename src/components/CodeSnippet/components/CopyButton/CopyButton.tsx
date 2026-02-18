import { IconCopy } from "../../../../icons/IconCopy";
import { ToggleButton } from "../../../ToggleButton/ToggleButton";
import { Button } from "./CopyButton.styled";
import type { CopyButtonProps } from "./types";

export const CopyButton = ({ ref, copied, onCopy, ...rest }: CopyButtonProps) => (
  <Button
    ref={ref}
    type="button"
    toggleable={false}
    toggled={copied}
    onClick={onCopy}
    data-component="CopyButton"
    {...rest}
  >
    <IconCopy />
    <ToggleButton.ButtonText>{copied ? "Copied!" : "Copy"}</ToggleButton.ButtonText>
  </Button>
);
