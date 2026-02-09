import type { PointerEvent, ReactNode, Ref } from "react";

export type FocalPointEditorWrapperProps = {
  aspectRatio?: number;
  cursor: string;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerCancel?: (event: PointerEvent<HTMLDivElement>) => void;
  children: ReactNode;
  /** Ref forwarded to the content div that receives pointer events. Used for non-passive listeners on mobile. */
  contentRef?: Ref<HTMLDivElement>;
};
