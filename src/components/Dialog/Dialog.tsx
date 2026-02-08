import { useEffect, useEffectEvent, useRef, useState } from "react";
import { mergeRefs } from "react-merge-refs";
import { DialogWrapper } from "./Dialog.styled";
import type { DialogProps } from "./types";

export function Dialog({
  ref,
  transparent,
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...rest
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mergedRefs = mergeRefs([dialogRef, ref]);

  const [isOpen, setIsOpen] = useState(open ?? defaultOpen ?? false);

  const stableOnOpenChange = useEffectEvent((open: boolean) => {
    onOpenChange?.(open);
  });

  useEffect(() => {
    setIsOpen(open ?? false);
    stableOnOpenChange(open ?? false);
  }, [open]);

  useEffect(() => {
    if (dialogRef.current == null) return;

    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (dialogRef.current == null) return;

    const onClose = () => {
      setIsOpen(false);
      stableOnOpenChange(false);
    };

    dialogRef.current.addEventListener("close", onClose);

    return () => {
      dialogRef.current?.removeEventListener("close", onClose);
    };
  }, []);

  return (
    <DialogWrapper
      ref={mergedRefs}
      css={{ backgroundColor: transparent ? "transparent" : "white" }}
      {...rest}
    >
      {children}
    </DialogWrapper>
  );
}
