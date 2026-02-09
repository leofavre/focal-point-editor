import type { PropsWithChildren, Ref } from "react";

export type DialogProps = PropsWithChildren<{
  ref?: Ref<HTMLDialogElement>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  transparent?: boolean;
}>;
