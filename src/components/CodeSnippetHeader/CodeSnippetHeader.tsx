import { getLanguageFromOptions } from "../CodeSnippet/helpers/getCodeSnippet";
import { Actions } from "./CodeSnippetHeader.styled";
import type { CodeSnippetHeaderProps } from "./types";

export function CodeSnippetHeader({
  codeSnippetLanguage,
  setCodeSnippetLanguage,
  ...rest
}: CodeSnippetHeaderProps) {
  const useReact = codeSnippetLanguage === "react" || codeSnippetLanguage === "react-tailwind";

  const useTailwind =
    codeSnippetLanguage === "tailwind" || codeSnippetLanguage === "react-tailwind";

  return (
    <Actions data-component="CodeSnippetHeader" {...rest}>
      <label>
        <input
          type="checkbox"
          checked={useReact}
          onChange={(e) =>
            setCodeSnippetLanguage(getLanguageFromOptions(e.target.checked, useTailwind))
          }
        />
        React
      </label>
      <label>
        <input
          type="checkbox"
          checked={useTailwind}
          onChange={(e) =>
            setCodeSnippetLanguage(getLanguageFromOptions(useReact, e.target.checked))
          }
        />
        Tailwind
      </label>
    </Actions>
  );
}
