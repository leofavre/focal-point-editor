import type { ObjectPositionString } from "../../types";

export type Breakpoint = {
  objectPosition: ObjectPositionString;
};

export type AdvancedBreakpoint = {
  aspectRatio: number;
  objectPosition: ObjectPositionString;
};

export type ImageState = {
  name: string;
  url: string;
  type: string;
  createdAt: number;
  naturalAspectRatio: number;
  breakpoints?: (Breakpoint | AdvancedBreakpoint)[];
};

export type ImageRecord = ImageState & {
  id: string;
  file: Blob;
};

export type UIState = {
  aspectRatio: number;
  showPointMarker: boolean;
  showGhostImage: boolean;
  showCodeSnippet: boolean;
};

export type UIRecord<T extends keyof UIState> = {
  [K in T]: { id: K; value: UIState[K] };
};

export type GeneratorState = {
  ui: UIState;
  images: ImageState[];
};
