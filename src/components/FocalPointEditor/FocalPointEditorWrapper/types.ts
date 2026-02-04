import type { PointerEvent, ReactNode } from "react";

export type FocalPointEditorWrapperProps = {
  aspectRatio?: number;
  cursor: string;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel?: (event: PointerEvent<HTMLDivElement>) => void;
  children: ReactNode;
};
