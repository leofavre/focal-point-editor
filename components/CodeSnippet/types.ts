import type { Ref } from "react";
import type { CodeSnippetLanguage, ObjectPositionString } from "@/src/types";

export type CodeSnippetProps = {
  ref?: Ref<HTMLPreElement>;
  src: string;
  objectPosition: ObjectPositionString;
  language?: CodeSnippetLanguage;
  triggerAutoFocus?: boolean;
};
