import styled from "@emotion/styled";

export const Button = styled.button`
  --scale: 1;
  &[data-scale="2"] { --scale: 2; }
  --shadow-offset: calc(0.25rem * var(--scale));

  --transition-prop:
    color 66ms ease-in-out,
    background-color 66ms ease-in-out,
    border-color 66ms ease-in-out,
    box-shadow 66ms ease-in-out,
    transform 66ms ease-in-out;

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
  border: calc(1px * var(--scale)) solid rgb(from var(--color-neutral) r g b);
  color: rgb(from var(--color-neutral) r g b);
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0px 0px var(--color-neutral);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  font: inherit;
  font-size: calc(14 / 16 * 1rem * var(--scale));
  white-space: nowrap;
  width: 100%;
  transition: var(--transition-prop);

  @media (hover: hover) {
    &:hover {
      background-color: rgb(from var(--color-neutral) r g b / 10%);
      border-color: rgb(from var(--color-neutral) r g b);
      color: rgb(from var(--color-neutral) r g b);
      box-shadow: var(--shadow-offset) var(--shadow-offset) 0px 0px var(--color-neutral);
      transition: var(--transition-prop);
    }
  }
  @media (hover: none) {
    &:active {
      background-color: rgb(from var(--color-neutral) r g b / 10%);
      border-color: rgb(from var(--color-neutral) r g b);
      color: rgb(from var(--color-neutral) r g b);
      box-shadow: var(--shadow-offset) var(--shadow-offset) 0px 0px var(--color-neutral);
      transition: var(--transition-prop);
    }
  }

  &:focus-visible {
    outline: calc(0.25rem * var(--scale)) solid var(--color-glow);
    border-radius: 0rem;
    outline-offset: 0;
  }

  &[aria-pressed="true"] {
    background-color: rgb(from var(--color-loud) r g b / 10%);
    border-color: rgb(from var(--color-loud) r g b);
    color: rgb(from var(--color-loud) r g b);
    box-shadow: 0px 0px 0px 0px var(--color-neutral);
    transform: translate(var(--shadow-offset), var(--shadow-offset));
    transition: var(--transition-prop);

    @media (hover: hover) {
      &:hover {
        background-color: rgb(from var(--color-loud) r g b / 20%);
        border-color: rgb(from var(--color-loud) r g b);
        color: rgb(from var(--color-loud) r g b);
        box-shadow: 0px 0px 0px 0px var(--color-neutral);
        transition: var(--transition-prop);
      }
    }
    @media (hover: none) {
      &:active {
        background-color: rgb(from var(--color-loud) r g b / 20%);
        border-color: rgb(from var(--color-loud) r g b);
        color: rgb(from var(--color-loud) r g b);
        box-shadow: 0px 0px 0px 0px var(--color-neutral);
        transition: var(--transition-prop);
      }
    }
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
