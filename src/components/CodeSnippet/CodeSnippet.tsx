import { useEffect, useState } from "react";
import { CodeBlock } from "react-code-block";
import { Code, CodeWrapper, CopyButton, Line, LineContent, LineNumber } from "./CodeSnippet.styled";
import type { CodeSnippetProps } from "./types";

const getCodeSnippet = ({ src, objectPosition }: CodeSnippetProps) => `<img
  src="${src}"
  style="object-fit: cover; object-position: ${objectPosition};"
/>`;

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

  useEffect(() => {
    setCopied(copiedProp);
  }, [copiedProp]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      onCopiedChange?.(true);
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
