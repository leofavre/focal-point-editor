import type { ObjectPositionString } from "../../types";

export type Breakpoint = {
  objectPosition: ObjectPositionString;
};

export type AdvancedBreakpoint = {
  aspectRatio: number;
  objectPosition: ObjectPositionString;
};

export type ImageState = {
  id: string;
  file: Blob;
  type: string;
  createdAt: number;
  breakpoints: (Breakpoint | AdvancedBreakpoint)[];
};

export type UIState = {
  aspectRatio: number;
  showPointMarker: boolean;
  showGhostImage: boolean;
  showCodeSnippet: boolean;
};

export type GeneratorState = {
  ui: UIState;
  images: ImageState[];
};
