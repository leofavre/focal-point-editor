import styled from "@emotion/styled";

export const ButtonWrapper = styled.span`
  --scale: 1;

  &[data-scale="2"] {
    --scale: 2;
  }

  --shadow-offset: calc(0.25rem * var(--scale));
  --transform-in: translate(0, 0);
  --transform-out: translate(var(--shadow-offset), var(--shadow-offset));
  
  position: relative;
  display: block;
`;

export const Button = styled.button`

  container-type: inline-size;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: calc(var(--base-line-025x) * var(--scale));
  min-width: calc((var(--base-line) + var(--base-line-05x)) * var(--scale));
  height: calc(2rem * var(--scale));
  padding: 0 calc(var(--base-line-025x) * var(--scale));
  box-sizing: border-box;
  background-color: white;
  border: calc(1px * var(--scale)) solid var(--color-neutral);
  color: var(--color-neutral);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  font: inherit;
  font-size: calc(14 / 16 * 1rem * var(--scale));
  white-space: nowrap;
  width: 100%;
  appearance: none;
  user-select: none;
  touch-action: none;
  transition: background-color 66ms ease-in-out, transform 66ms ease-in-out;
  transform: var(--transform-in);
  z-index: 1;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background-color: var(--color-neutral-tint-10);
    }
  
    &:active:not(:disabled) {
      transform: var(--transform-out);
    }
  }

  &:not([data-toggleable]):active {
    transform: var(--transform-out);
  }

  &[data-toggleable][aria-pressed="true"] {
    transform: var(--transform-out);

    @media (hover: hover) {
      &:active:not(:disabled) {
        transform: var(--transform-in);
      }
    }
  }

  &:disabled {
    transition: none;
    border-color: var(--color-neutral-tint-30);
    color: var(--color-neutral-tint-30);
    cursor: default;
  }

  &:focus-visible {
    outline: calc(0.25rem * var(--scale)) solid var(--color-glow);
    border-radius: 0rem;
    outline-offset: 0;
  }

  svg {
    width: calc(var(--base-line) * var(--scale));
    height: calc(var(--base-line) * var(--scale));
    flex-shrink: 0;
  }

  /* calc won't work in the container query */
  @container (max-width: 6rem) {
    & > svg { margin: auto; }
    & > span { display: none; }
  }

  /* calc won't work in the container query */
  &[data-scale=2] {
    @container (max-width: 12rem) {
      & > svg { margin: auto; }
      & > span { display: none; }
    }
  }
`;

export const Shadow = styled.span`
  display: block;
  position: absolute;
  inset: 0;
  transform: var(--transform-out);
  background-color: var(--color-neutral);
  z-index: 0;

  *:disabled + & {
    background-color: var(--color-neutral-tint-30);
  }
`;

export const ButtonText = styled.span``;
