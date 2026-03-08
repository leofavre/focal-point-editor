import type { ClipboardEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import { CodeBlock } from "react-code-block";
import { useMergeRefs } from "react-merge-refs";
import { Code, Container, Line, LineContent, LineNumber, Wrapper } from "./CodeSnippet.styled";
import { codeSnippetTheme } from "./codeSnippetTheme";
import { CopyButton } from "./components/CopyButton/CopyButton";
import { getCodeBlockLanguage, getCodeSnippet } from "./helpers/getCodeSnippet";
import { normalizeWhitespaceInQuotes } from "./helpers/normalizeWhitespaceInQuotes";
import { useCopyToClipboard } from "./hooks/useCopyToClipboard";
import type { CodeSnippetProps } from "./types";

export function CodeSnippet({
  ref,
  src,
  objectPosition,
  language = "html",
  triggerAutoFocus = false,
  ...rest
}: CodeSnippetProps) {
  const snippetText = getCodeSnippet({
    language,
    src,
    objectPosition,
  });

  const { onCopy } = useCopyToClipboard(snippetText);

  const codeSnippet = getCodeSnippet({ language, src, objectPosition });
  const codeBlockLanguage = getCodeBlockLanguage(language);

  const codeRef = useRef<HTMLPreElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const mergedCodeRef = useMergeRefs([codeRef, ref]);

  /**
   * Automatically focus the copy button after a short delay.
   */
  useEffect(() => {
    if (!triggerAutoFocus) return;

    const asyncAutoFocus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      copyButtonRef.current?.focus();
    };

    asyncAutoFocus();
  }, [triggerAutoFocus]);

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

  return (
    <Container data-component="CodeSnippet" {...rest}>
      <Wrapper onCopy={handleCopyCapture}>
        <CopyButton ref={copyButtonRef} onCopy={onCopy} />
        <CodeBlock code={codeSnippet} language={codeBlockLanguage} theme={codeSnippetTheme}>
          <Code data-component="CodeBlock" ref={mergedCodeRef} className="notranslate">
            <Line>
              <LineNumber aria-hidden="true" />
              <LineContent>
                <CodeBlock.Token />
              </LineContent>
            </Line>
          </Code>
        </CodeBlock>
      </Wrapper>
    </Container>
  );
}
