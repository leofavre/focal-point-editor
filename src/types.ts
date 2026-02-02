import type { Simplify } from "type-fest";
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
  file: File;
};

export type ImageState = Simplify<
  ImageDraftState & {
    url: string;
    naturalAspectRatio: number;
  }
>;

export type ImageRecord = Simplify<
  ImageDraftState & {
    id: string;
    file: Blob;
  }
>;

export type UIState = {
  aspectRatio: number;
  showPointMarker: boolean;
  showGhostImage: boolean;
  showCodeSnippet: boolean;
};

export type UIRecord<T extends keyof UIState> = { id: T; value: UIState[T] };

export type EditorState = {
  ui: UIState;
  images: ImageState[];
};
