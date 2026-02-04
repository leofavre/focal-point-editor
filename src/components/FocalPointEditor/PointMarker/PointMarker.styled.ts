import styled from "@emotion/styled";

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 2rem;
  height: 2rem;
  margin: -1rem 0 0 -1rem;
  pointer-events: auto;
  touch-action: none;
  user-select: none;
  transition: opacity 0.25s ease;
  z-index: 2;
  cursor: grab;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 2rem;
    height: 2rem;
    pointer-events: none;
  }

  svg:nth-of-type(1) {
    transform: translate(-1px, -1px);
    opacity: 0.65;
    color: #fff;
  }

  svg:nth-of-type(2) {
    color: #111827;
  }
`;
