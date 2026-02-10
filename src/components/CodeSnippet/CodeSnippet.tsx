import copy from "copy-to-clipboard";
import type { ClipboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { CodeBlock } from "react-code-block";
import {
  Code,
  CopyButton,
  Line,
  LineContent,
  LineNumber,
  TabBar,
  TabButton,
  Wrapper,
} from "./CodeSnippet.styled";
import { normalizeWhitespaceInQuotes } from "./helpers/normalizeWhitespaceInQuotes";
import type { CodeSnippetProps } from "./types";

function getCodeSnippetHtml(src: string, objectPosition: string): string {
  return `<img
  src="${src}"
  style="
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${objectPosition};
  "
/>`;
}

function getCodeSnippetReact(src: string, objectPosition: string): string {
  return `<img
  src="${src}"
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: '${objectPosition}',
  }}
/>`;
}

function getCodeSnippetTailwind(src: string, objectPosition: string): string {
  const objectPositionClass = objectPosition.replace(/ /g, "_");
  return `<img
  src="${src}"
  class="
    w-full
    h-full
    object-cover
    object-[${objectPositionClass}]
  "
/>`;
}

function getCodeSnippetReactTailwind(src: string, objectPosition: string): string {
  const objectPositionClass = objectPosition.replace(/ /g, "_");
  return `<img
  src="${src}"
  className="
    w-full
    h-full
    object-cover
    object-[${objectPositionClass}]
  "
/>`;
}

function getCodeSnippet(
  language: CodeSnippetProps["language"],
  src: string,
  objectPosition: string,
): string {
  switch (language) {
    case "tailwind":
      return getCodeSnippetTailwind(src, objectPosition);
    case "react":
      return getCodeSnippetReact(src, objectPosition);
    case "react-tailwind":
      return getCodeSnippetReactTailwind(src, objectPosition);
    default:
      return getCodeSnippetHtml(src, objectPosition);
  }
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
  const codeSnippet = getCodeSnippet(language, src, objectPosition);
  const codeBlockLanguage = language === "react" || language === "react-tailwind" ? "jsx" : "html";

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

  const handleCopy = () => {
    const textToCopy = normalizeWhitespaceInQuotes(codeSnippet);
    const success = copy(textToCopy, { format: "text/plain" });

    if (success) {
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
    } else {
      /**
       * @todo
       *
       * Handle copy error.
       */
      setCopied(false);
      onCopiedChange?.(false);
    }
  };

  return (
    <Wrapper data-component="CodeSnippet" onCopy={handleCopyCapture} {...rest}>
      <TabBar role="tablist" aria-label="Code snippet format">
        <TabButton
          type="button"
          role="tab"
          aria-selected={language === "html"}
          onClick={() => onLanguageChange?.("html")}
          className="notranslate"
        >
          HTML
        </TabButton>
        <TabButton
          type="button"
          role="tab"
          aria-selected={language === "tailwind"}
          onClick={() => onLanguageChange?.("tailwind")}
          className="notranslate"
        >
          Tailwind
        </TabButton>
        <TabButton
          type="button"
          role="tab"
          aria-selected={language === "react"}
          onClick={() => onLanguageChange?.("react")}
          className="notranslate"
        >
          React
        </TabButton>
        <TabButton
          type="button"
          role="tab"
          aria-selected={language === "react-tailwind"}
          onClick={() => onLanguageChange?.("react-tailwind")}
          className="notranslate"
        >
          React + Tailwind
        </TabButton>
      </TabBar>
      <CopyButton type="button" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy"}
      </CopyButton>
      <CodeBlock code={codeSnippet} language={codeBlockLanguage}>
        <Code ref={ref} className="notranslate">
          <Line>
            <LineNumber />
            <LineContent>
              <CodeBlock.Token />
            </LineContent>
          </Line>
        </Code>
      </CodeBlock>
    </Wrapper>
  );
}
