import { LabeledCheckbox } from "../CodeSnippet/components/LabeledCheckbox/LabeledCheckbox";
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
      <LabeledCheckbox
        checked={useReact}
        onChange={(e) =>
          setCodeSnippetLanguage(getLanguageFromOptions(e.target.checked, useTailwind))
        }
        label="React"
      />
      <LabeledCheckbox
        checked={useTailwind}
        onChange={(e) => setCodeSnippetLanguage(getLanguageFromOptions(useReact, e.target.checked))}
        label="Tailwind CSS"
      />
    </Actions>
  );
}
