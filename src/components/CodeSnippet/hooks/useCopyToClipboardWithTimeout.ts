import { useCallback, useEffect, useRef, useState } from "react";
import { copyToClipboard } from "../helpers/copyToClipboard";
import { normalizeWhitespaceInQuotes } from "../helpers/normalizeWhitespaceInQuotes";

const COPY_RESET_MS = 3_000;

export function useCopyToClipboardWithTimeout(
  text: string,
  options?: { copied?: boolean; onCopiedChange?: (copied: boolean) => void },
): { copied: boolean; onCopy: () => Promise<void> } {
  const { copied: copiedProp = false, onCopiedChange } = options ?? {};
  const [copied, setCopied] = useState(copiedProp);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCopied(copiedProp);
  }, [copiedProp]);

  const onCopy = useCallback(async () => {
    const textToCopy = normalizeWhitespaceInQuotes(text);
    const success = await copyToClipboard(textToCopy);

    if (!success) {
      setCopied(false);
      onCopiedChange?.(false);
      return;
    }

    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
    }

    setCopied(true);
    onCopiedChange?.(true);

    copyResetTimeoutRef.current = setTimeout(() => {
      setCopied(false);
      onCopiedChange?.(false);
      copyResetTimeoutRef.current = null;
    }, COPY_RESET_MS);
  }, [text, onCopiedChange]);

  return { copied, onCopy };
}
