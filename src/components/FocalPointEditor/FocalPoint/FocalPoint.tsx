import type { PointerEvent } from "react";
import { useCallback, useEffectEvent, useRef } from "react";
import { clamp } from "../helpers/clamp";
import { cssObjectPositionObjectToString } from "../helpers/cssObjectPositionObjectToString";
import { Wrapper } from "./FocalPoint.styled";
import type { FocalPointProps } from "./types";

export function FocalPoint({ onObjectPositionChange, ...rest }: FocalPointProps) {
  const isDraggingRef = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    isDraggingRef.current = true;

    event.currentTarget.setPointerCapture(event.pointerId);
  }, []);

  const stableOnObjectPositionChange = useEffectEvent(onObjectPositionChange);

  const handlePointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || wrapperRef.current == null) return;

    event.preventDefault();
    event.stopPropagation();

    const parent = wrapperRef.current.parentElement;
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
    <Wrapper
      ref={wrapperRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      {...rest}
    >
      <FocalPointIcon />
      <FocalPointIcon />
    </Wrapper>
  );
}

function FocalPointIcon() {
  return (
    /** biome-ignore lint/a11y/noSvgWithoutTitle: Image hidden from screen readers */
    <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor">
        <circle
          cx="50"
          cy="50"
          r="38"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="50" y1="6" x2="50" y2="26" strokeWidth="6" strokeLinecap="round" />
        <line x1="50" y1="74" x2="50" y2="94" strokeWidth="6" strokeLinecap="round" />
        <line x1="6" y1="50" x2="26" y2="50" strokeWidth="6" strokeLinecap="round" />
        <line x1="74" y1="50" x2="94" y2="50" strokeWidth="6" strokeLinecap="round" />
      </g>
    </svg>
  );
}
