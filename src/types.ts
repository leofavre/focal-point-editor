import type { Simplify, Tagged } from "type-fest";

export type ImageId = Tagged<string, "ImageId">;

export type ObjectPositionString = `${string}% ${string}%`;

export type ObjectPositionObject = { x: number; y: number };

export type Breakpoint = {
  objectPosition: ObjectPositionString;
};

export type AdvancedBreakpoint = {
  contentQuery: number;
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

export type ImageDraftStateAndUrl = {
  imageDraft: ImageDraftState;
  url: string;
};

export type ImageState = Simplify<
  ImageDraftState & {
    url: string;
    naturalAspectRatio: number;
  }
>;

export type ImageRecordWithFile = Simplify<
  ImageDraftState & {
    id: ImageId;
    file: Blob;
    lastKnownAspectRatio?: number;
  }
>;

export type ImageRecordWithUrl = Simplify<
  ImageDraftState & {
    id: ImageId;
    url: string;
    lastKnownAspectRatio?: number;
  }
>;

export type ImageRecord = ImageRecordWithFile | ImageRecordWithUrl;

export function hasFile(record: ImageRecord): record is ImageRecordWithFile {
  return "file" in record && record.file != null;
}

export function hasUrl(record: ImageRecord): record is ImageRecordWithUrl {
  return "url" in record && typeof record.url === "string";
}

export function isImageDraftStateAndUrl(
  x: ImageDraftStateAndFile | ImageDraftStateAndUrl,
): x is ImageDraftStateAndUrl {
  return "url" in x && x.url != null;
}

export type CodeSnippetLanguage = "html" | "tailwind" | "react" | "react-tailwind";

export type UIState = {
  aspectRatio: number;
  showFocalPoint: boolean;
  showImageOverflow: boolean;
  showCodeSnippet: boolean;
  codeSnippetLanguage: CodeSnippetLanguage;
};

export type UIRecord<T extends keyof UIState> = { id: T; value: UIState[T] };

export type UIPersistenceMode = "singleImage" | "multipleImages";

export type UIPageState = "landing" | "editing" | "pageNotFound" | "imageNotFound" | "privacy";
