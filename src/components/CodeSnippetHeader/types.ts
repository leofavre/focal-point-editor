import type { ComponentPropsWithoutRef } from "react";
import type { CodeSnippetLanguage } from "../../types";

export type CodeSnippetHeaderProps = {
  codeSnippetLanguage: CodeSnippetLanguage;
  setCodeSnippetLanguage: (language: CodeSnippetLanguage) => void;
} & ComponentPropsWithoutRef<"div">;
