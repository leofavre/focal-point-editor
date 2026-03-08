import { useCallback } from "react";
import { copyTextToClipboardWithToast } from "../helpers/copyToClipboard";

export function useCopyToClipboard(text: string): { onCopy: () => Promise<void> } {
  const onCopy = useCallback(() => copyTextToClipboardWithToast(text), [text]);

  return { onCopy };
}
