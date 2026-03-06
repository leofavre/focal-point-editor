import styled from "@emotion/styled";

export const Wrapper = styled.div`
  --pointer-size: 4rem;

  position: absolute;
  top: 0;
  left: 0;
  width: calc(var(--pointer-size) * 0.5);
  height: calc(var(--pointer-size) * 0.5);
  margin: calc(var(--pointer-size) * -0.25) 0 0 calc(var(--pointer-size) * -0.25);
  pointer-events: auto;
  touch-action: none;
  user-select: none;
  cursor: grab;

  @supports (anchor-name: --focal-center) {
    anchor-name: --focal-center;
  }
`;

export const Cross = styled.div`
  position: absolute;
  inset: calc(var(--pointer-size) * -0.25);
  transition: opacity 66ms ease;

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

export const Badge = styled.span`
  display: none;

  @supports (position-anchor: --focal-center) and (position-try-fallbacks: flip-block) {
    display: inline-block;
    position: fixed;
    position-anchor: --focal-center;
    position-area: top right;
    margin: 0rem;
    position-try-fallbacks: flip-inline, flip-block, flip-block flip-inline;
    padding: 0 var(--base-line-05x);
    background-color: var(--color-body);
    color: var(--color-neutral-tint-30);
    font-family: "Sono", monospace;
    font-size: calc(12 / 16 * 1rem);
    line-height: var(--base-line);
    white-space: pre;
    pointer-events: none;
  }

  [dir="rtl"] & {
    @supports (position-anchor: --focal-center) and (position-try-fallbacks: flip-block) {
      position-area: top left;
    }
  }
`;
