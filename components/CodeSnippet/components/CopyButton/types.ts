import type { Ref } from "react";

export type CopyButtonProps = {
  ref?: Ref<HTMLButtonElement>;
  onCopy: () => void;
};
