import type { ClipboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CodeBlock } from "react-code-block";
import type { CodeSnippetLanguage } from "../../types";
import { ToggleButton } from "../ToggleButton/ToggleButton";
import { ButtonText } from "../ToggleButton/ToggleButton.styled";
import {
  CheckboxGroup,
  Code,
  Line,
  LineContent,
  LineNumber,
  OptionsRow,
  Wrapper,
} from "./CodeSnippet.styled";
import { codeSnippetTheme } from "./codeSnippetTheme";
import { copyToClipboard } from "./helpers/copyToClipboard";
import { normalizeWhitespaceInQuotes } from "./helpers/normalizeWhitespaceInQuotes";
import type { CodeSnippetProps } from "./types";

function getLanguageFromOptions(useReact: boolean, useTailwind: boolean): CodeSnippetLanguage {
  if (useReact && useTailwind) return "react-tailwind";
  if (useReact) return "react";
  if (useTailwind) return "tailwind";
  return "html";
}

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
  const useReact = language === "react" || language === "react-tailwind";
  const useTailwind = language === "tailwind" || language === "react-tailwind";

  const codeSnippet = getCodeSnippet(language, src, objectPosition);
  const codeBlockLanguage = language === "react" || language === "react-tailwind" ? "jsx" : "html";

  const [copied, setCopied] = useState(copiedProp);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCopied(copiedProp);
  }, [copiedProp]);

  const handleUseReactChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      onLanguageChange?.(getLanguageFromOptions(checked, useTailwind));
    },
    [onLanguageChange, useTailwind],
  );

  const handleUseTailwindChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      onLanguageChange?.(getLanguageFromOptions(useReact, checked));
    },
    [onLanguageChange, useReact],
  );

  const handleCopyCapture = useCallback((event: ClipboardEvent) => {
    const { clipboardData } = event;
    if (clipboardData == null) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString() ?? "";
    if (selectedText.length === 0) return;

    event.preventDefault();
    clipboardData.clearData();
    clipboardData.setData("text/plain", normalizeWhitespaceInQuotes(selectedText));
  }, []);

  const handleCopy = useCallback(async () => {
    const textToCopy = normalizeWhitespaceInQuotes(codeSnippet);
    const success = await copyToClipboard(textToCopy);

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
  }, [codeSnippet, onCopiedChange]);

  return (
    <Wrapper data-component="CodeSnippet" onCopy={handleCopyCapture} {...rest}>
      <OptionsRow>
        <CheckboxGroup>
          <label>
            <input
              type="checkbox"
              checked={useReact}
              onChange={handleUseReactChange}
              aria-label="use React"
            />
            {" use React"}
          </label>
          <label>
            <input
              type="checkbox"
              checked={useTailwind}
              onChange={handleUseTailwindChange}
              aria-label="use Tailwind"
            />
            {" use Tailwind"}
          </label>
        </CheckboxGroup>
        <ToggleButton type="button" toggleable={false} toggled={copied} onClick={handleCopy}>
          <ButtonText>{copied ? "Copied!" : "Copy"}</ButtonText>
        </ToggleButton>
      </OptionsRow>
      <CodeBlock code={codeSnippet} language={codeBlockLanguage} theme={codeSnippetTheme}>
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
