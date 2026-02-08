import type { RefObject } from "react";

export function useNativeDialog(ref: RefObject<HTMLDialogElement | null>) {
  const openDialog = () => {
    if (!ref.current) return;
    ref.current.showModal();
  };

  const closeDialog = () => {
    if (!ref.current) return;
    ref.current.close();
  };

  const toggleDialog = () => {
    if (!ref.current) return;

    if (ref.current.open) {
      ref.current.close();
    } else {
      ref.current.showModal();
    }
  };

  return { openDialog, closeDialog, toggleDialog };
}
