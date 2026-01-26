import styled from "@emotion/styled";
import type { PointMarkerProps } from "./types";

const PointerMarkerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  transition: opacity 0.25s ease;
  z-index: 2;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 2rem;
    height: 2rem;
  }

  svg:nth-of-type(1) {
    transform: translate(-49%, -49%);
    opacity: 0.65;
    color: #fff;
  }

  svg:nth-of-type(2) {
    transform: translate(-50%, -50%);
    color: #111827;
  }
`;

export function PointMarker({ ...rest }: PointMarkerProps) {
  return (
    <PointerMarkerWrapper {...rest}>
      <PointMarkerIcon />
      <PointMarkerIcon />
    </PointerMarkerWrapper>
  );
}

function PointMarkerIcon() {
  return (
    /** biome-ignore lint/a11y/noSvgWithoutTitle: Image hidden from screen readers */
    <svg viewBox="0 0 100 100" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor">
        <circle
          cx="50"
          cy="50"
          r="38"
          stroke-width="6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <line x1="50" y1="6" x2="50" y2="26" stroke-width="6" stroke-linecap="round" />
        <line x1="50" y1="74" x2="50" y2="94" stroke-width="6" stroke-linecap="round" />
        <line x1="6" y1="50" x2="26" y2="50" stroke-width="6" stroke-linecap="round" />
        <line x1="74" y1="50" x2="94" y2="50" stroke-width="6" stroke-linecap="round" />
      </g>
    </svg>
  );
}
