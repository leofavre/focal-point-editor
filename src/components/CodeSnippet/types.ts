import type { Ref } from "react";
import type { CodeSnippetLanguage, ObjectPositionString } from "../../types";

export type CodeSnippetProps = {
  ref?: Ref<HTMLPreElement>;
  src: string;
  objectPosition: ObjectPositionString;
  language?: CodeSnippetLanguage;
  onLanguageChange?: (language: CodeSnippetLanguage) => void;
  copied?: boolean;
  onCopiedChange?: (copied: boolean) => void;
};
