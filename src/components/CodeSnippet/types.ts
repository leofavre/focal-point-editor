import type { RefObject } from "react";
import type { ObjectPositionString } from "../../types";

export type CodeSnippetProps = {
  ref?: RefObject<HTMLPreElement | null>;
  src: string;
  objectPosition: ObjectPositionString;
};
