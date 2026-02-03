import type { RefObject } from "react";
import type { CodeSnippetLanguage, ObjectPositionString } from "../../types";

export type CodeSnippetProps = {
  ref?: RefObject<HTMLPreElement | null>;
  src: string;
  objectPosition: ObjectPositionString;
  language?: CodeSnippetLanguage;
  onLanguageChange?: (language: CodeSnippetLanguage) => void;
  copied?: boolean;
  onCopiedChange?: (copied: boolean) => void;
};
