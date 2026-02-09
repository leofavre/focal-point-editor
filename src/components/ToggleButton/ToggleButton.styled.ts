import styled from "@emotion/styled";

export const Button = styled.button`
  --scale: 1;
  --shadow-offset: calc(0.25rem * var(--scale));

  container-type: inline-size;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: calc(var(--base-line-025x) * var(--scale));
  min-width: calc((var(--base-line) + var(--base-line-05x)) * var(--scale));
  height: calc(2rem * var(--scale));
  padding: 0 calc(var(--base-line-025x) * var(--scale));
  border: calc(1px * var(--scale)) solid rgb(from var(--color-neutral) r g b);
  background-color: #fff;
  box-sizing: border-box;
  color: rgb(from var(--color-neutral) r g b);
  cursor: pointer;
  font: inherit;
  font-size: calc(14 / 16 * 1rem * var(--scale));
  white-space: nowrap;
  box-shadow:
    var(--shadow-offset) var(--shadow-offset) 0 0 rgb(from var(--color-neutral) r g b / 100%);
  transition:
    background-color 30ms ease-in-out,
    border-color 30ms ease-in-out,
    color 30ms ease-in-out,
    box-shadow 30ms ease-in-out,
    transform 30ms ease-in-out;

  &:hover {
    background-color: rgb(from var(--color-neutral) r g b / 10%);
    border-color: rgb(from var(--color-neutral) r g b);
    color: rgb(from var(--color-neutral) r g b);
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
    box-shadow: none;
    transform: translate(var(--shadow-offset), var(--shadow-offset));

    &:hover {
      background-color: rgb(from var(--color-loud) r g b / 20%);
      border-color: rgb(from var(--color-loud) r g b);
      color: rgb(from var(--color-loud) r g b);
    }
  }

  svg {
    width: calc(var(--base-line) * var(--scale));
    height: calc(var(--base-line) * var(--scale));
    flex-shrink: 0;
  }

  @container (max-width: calc(6rem * var(--scale))) {
    & > svg {
      margin: auto;
    }

    & > span {
      display: none;
    }
  }
`;
