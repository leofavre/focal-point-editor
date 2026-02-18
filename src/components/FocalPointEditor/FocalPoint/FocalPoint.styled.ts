import styled from "@emotion/styled";

export const Cross = styled.div`
  --pointer-size: 4rem;

  position: absolute;
  top: 0;
  left: 0;
  width: var(--pointer-size);
  height: var(--pointer-size);
  margin: calc(var(--pointer-size) * -0.5) 0 0 calc(var(--pointer-size) * -0.5);
  pointer-events: auto;
  touch-action: none;
  user-select: none;
  transition: opacity 66ms ease;
  z-index: 2;
  cursor: grab;
  z-index: 10;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: gray;
    pointer-events: none;
  }

  &::before {
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    margin-top: -0.5px;
  }

  &::after {
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    margin-left: -0.5px;
  }

  @supports (backdrop-filter: invert(100%)) and (mask-image: url("/reference.svg")) {
    backdrop-filter: invert(100%);
    background-color: transparent;
    mask-image: url("/reference.svg");
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;

    &::before,
    &::after {
      display: none;
    }
  }
`;
