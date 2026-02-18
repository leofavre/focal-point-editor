import type { ClipboardEvent } from "react";
import { useCallback, useEffect, useRef } from "react";
import { CodeBlock } from "react-code-block";
import { useMergeRefs } from "react-merge-refs";
import { Code, Container, Line, LineContent, LineNumber, Wrapper } from "./CodeSnippet.styled";
import { codeSnippetTheme } from "./codeSnippetTheme";
import { CopyButton } from "./components/CopyButton/CopyButton";
import { getCodeBlockLanguage, getCodeSnippet } from "./helpers/getCodeSnippet";
import { normalizeWhitespaceInQuotes } from "./helpers/normalizeWhitespaceInQuotes";
import { useCopyToClipboardWithTimeout } from "./hooks/useCopyToClipboardWithTimeout";
import type { CodeSnippetProps } from "./types";

export function CodeSnippet({
  ref,
  src,
  objectPosition,
  language = "html",
  codeSnippetCopied,
  setCodeSnippetCopied,
  ...rest
}: CodeSnippetProps) {
  const snippetText = getCodeSnippet({
    language,
    src,
    objectPosition,
  });

  const { copied, onCopy } = useCopyToClipboardWithTimeout(snippetText, {
    copied: codeSnippetCopied,
    onCopiedChange: setCodeSnippetCopied,
  });

  const codeSnippet = getCodeSnippet({ language, src, objectPosition });
  const codeBlockLanguage = getCodeBlockLanguage(language);

  const codeRef = useRef<HTMLPreElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);
  const mergedCodeRef = useMergeRefs([codeRef, ref]);

  useEffect(() => {
    const codeElement = codeRef.current;
    if (codeElement) {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(codeElement);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    copyButtonRef.current?.focus();
  }, []);

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
        <CopyButton ref={copyButtonRef} copied={copied} onCopy={onCopy} />
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
