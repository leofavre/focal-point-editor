import type { Simplify, Tagged } from "type-fest";

export type ImageId = Tagged<string, "ImageId">;

export type ObjectPositionString = `${string}% ${string}%`;

export type ObjectPositionObject = { x: number; y: number };

export type Breakpoint = {
  objectPosition: ObjectPositionString;
};

export type AdvancedBreakpoint = {
  aspectRatio: number;
  objectPosition: ObjectPositionString;
};

export type ImageDraftState = {
  name: string;
  type: string;
  createdAt: number;
  breakpoints: (Breakpoint | AdvancedBreakpoint)[];
};

export type ImageDraftStateAndFile = {
  imageDraft: ImageDraftState;
  file: Blob;
};

export type ImageState = Simplify<
  ImageDraftState & {
    url: string;
    naturalAspectRatio: number;
  }
>;

export type ImageRecord = Simplify<
  ImageDraftState & {
    id: ImageId;
    file: Blob;
  }
>;

export type CodeSnippetLanguage = "html" | "tailwind" | "react" | "react-tailwind";

export type UIState = {
  aspectRatio: number;
  showFocalPoint: boolean;
  showImageOverflow: boolean;
  showCodeSnippet: boolean;
  codeSnippetLanguage: CodeSnippetLanguage;
};

export type UIRecord<T extends keyof UIState> = { id: T; value: UIState[T] };

export type UIPersistenceMode = "ephemeral" | "persistent";
