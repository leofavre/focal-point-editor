import type { PointerEvent } from "react";
import { useCallback, useEffectEvent, useRef } from "react";
import { clamp } from "../helpers/clamp";
import { cssObjectPositionObjectToString } from "../helpers/cssObjectPositionObjectToString";
import { Cross } from "./FocalPoint.styled";
import type { FocalPointProps } from "./types";

export function FocalPoint({ onObjectPositionChange, ...rest }: FocalPointProps) {
  const isDraggingRef = useRef(false);
  const crossRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    isDraggingRef.current = true;

    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const stableOnObjectPositionChange = useEffectEvent(onObjectPositionChange);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || crossRef.current == null) return;

    event.preventDefault();
    event.stopPropagation();

    const parent = crossRef.current.parentElement;
    if (parent == null) return;

    const parentRect = parent.getBoundingClientRect();
    const x = event.clientX - parentRect.left;
    const y = event.clientY - parentRect.top;

    const xPercent = clamp((x / parentRect.width) * 100, 0, 100);
    const yPercent = clamp((y / parentRect.height) * 100, 0, 100);

    const objectPosition = cssObjectPositionObjectToString({
      x: xPercent,
      y: yPercent,
    });

    stableOnObjectPositionChange(objectPosition);
  }, []);

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  const handlePointerCancel = useCallback((event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <Cross
      ref={crossRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      {...rest}
    />
  );
}
