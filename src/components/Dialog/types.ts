import type { PropsWithChildren, RefObject } from "react";

export type DialogProps = PropsWithChildren<{
  ref?: RefObject<HTMLDialogElement | null>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;
