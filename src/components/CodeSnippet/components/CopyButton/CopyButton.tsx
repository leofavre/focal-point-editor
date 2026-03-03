import { IconCopy } from "../../../../icons/IconCopy";
import { Button } from "../../../Button/Button";
import type { CopyButtonProps } from "./types";

export const CopyButton = ({ ref, onCopy, ...rest }: CopyButtonProps) => (
  <Button ref={ref} type="button" onClick={onCopy} data-component="CopyButton" {...rest}>
    <IconCopy />
    <Button.ButtonText>Copy</Button.ButtonText>
  </Button>
);
