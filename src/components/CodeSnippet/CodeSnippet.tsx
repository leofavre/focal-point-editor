import { useEffect, useRef, useState } from "react";
import { CodeBlock } from "react-code-block";
import { Code, CodeWrapper, CopyButton, Line, LineContent, LineNumber } from "./CodeSnippet.styled";
import type { CodeSnippetProps } from "./types";

const getCodeSnippet = ({ src, objectPosition }: CodeSnippetProps) => `<img
  src="${src}"
  style="
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: ${objectPosition};
  "
/>`;

const COPY_RESET_MS = 2_000;

export function CodeSnippet({
  ref,
  src,
  objectPosition,
  copied: copiedProp = false,
  onCopiedChange,
  ...rest
}: CodeSnippetProps) {
  const codeSnippet = getCodeSnippet({ src, objectPosition });
  const [copied, setCopied] = useState(copiedProp);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCopied(copiedProp);
  }, [copiedProp]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
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
    <CodeWrapper data-component="CodeSnippet" {...rest}>
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
