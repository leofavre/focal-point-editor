import { CodeBlock } from "react-code-block";
import { Code, Line, LineContent, LineNumber } from "./CodeSnippet.styled";
import type { CodeSnippetProps } from "./types";

const getCodeSnippet = ({ src, objectPosition }: CodeSnippetProps) => `<img
  src="${src}"
  style="object-fit: cover; object-position: ${objectPosition};"
/>`;

export function CodeSnippet({ ref, src, objectPosition, ...rest }: CodeSnippetProps) {
  const codeSnippet = getCodeSnippet({ src, objectPosition });

  return (
    <CodeBlock code={codeSnippet} language="html">
      <Code data-component="CodeSnippet" ref={ref} {...rest}>
        <Line>
          <LineNumber />
          <LineContent>
            <CodeBlock.Token />
          </LineContent>
        </Line>
      </Code>
    </CodeBlock>
  );
}
