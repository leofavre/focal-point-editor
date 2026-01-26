import type { PointerEvent, ReactNode } from "react";

export type FocusPointEditorWrapperProps = {
  aspectRatio?: number;
  cursor: string;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  children: ReactNode;
};
