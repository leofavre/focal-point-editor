import { type ClipboardEvent, useEffect, useRef, useState } from "react";
import { CodeBlock } from "react-code-block";
import {
  Code,
  CodeWrapper,
  CopyButton,
  Line,
  LineContent,
  LineNumber,
  TabBar,
  TabButton,
} from "./CodeSnippet.styled";
import { normalizeWhitespaceInQuotes } from "./helpers/normalizeWhitespaceInQuotes";
import type { CodeSnippetProps } from "./types";

function getCodeSnippetHtml(src: string, objectPosition: string): string {
  return `<img
  src="${src}"
  style="
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: ${objectPosition};
  "
/>`;
}

function getCodeSnippetTailwind(src: string, objectPosition: string): string {
  const objectPositionClass = objectPosition.replace(/ /g, "_");
  return `<img
  src="${src}"
  class="
    w-full h-full
    object-cover
    object-[${objectPositionClass}]
  "
/>`;
}

const COPY_RESET_MS = 2_000;

export function CodeSnippet({
  ref,
  src,
  objectPosition,
  language = "html",
  onLanguageChange,
  copied: copiedProp = false,
  onCopiedChange,
  ...rest
}: CodeSnippetProps) {
  const codeSnippet =
    language === "tailwind"
      ? getCodeSnippetTailwind(src, objectPosition)
      : getCodeSnippetHtml(src, objectPosition);

  const [copied, setCopied] = useState(copiedProp);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCopied(copiedProp);
  }, [copiedProp]);

  const handleCopyCapture = (event: ClipboardEvent) => {
    const { clipboardData } = event;
    if (clipboardData == null) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString() ?? "";
    if (selectedText.length === 0) return;

    event.preventDefault();
    clipboardData.clearData();
    clipboardData.setData("text/plain", normalizeWhitespaceInQuotes(selectedText));
  };

  const handleCopy = async () => {
    try {
      const textToCopy = normalizeWhitespaceInQuotes(codeSnippet);
      await navigator.clipboard.writeText(textToCopy);

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
    } catch {
      setCopied(false);
      onCopiedChange?.(false);
    }
  };

  return (
    <CodeWrapper data-component="CodeSnippet" onCopy={handleCopyCapture} {...rest}>
      <TabBar role="tablist" aria-label="Code snippet format">
        <TabButton
          type="button"
          role="tab"
          aria-selected={language === "html"}
          onClick={() => onLanguageChange?.("html")}
        >
          CSS
        </TabButton>
        <TabButton
          type="button"
          role="tab"
          aria-selected={language === "tailwind"}
          onClick={() => onLanguageChange?.("tailwind")}
        >
          Tailwind
        </TabButton>
      </TabBar>
      <CopyButton type="button" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </CopyButton>
      <CodeBlock code={codeSnippet} language="html">
        <Code ref={ref}>
          <Line>
            <LineNumber />
            <LineContent>
              <CodeBlock.Token />
            </LineContent>
          </Line>
        </Code>
      </CodeBlock>
    </CodeWrapper>
  );
}
