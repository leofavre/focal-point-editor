import styled from "@emotion/styled";

export const SmallButton = styled.button`
  container-type: inline-size;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--base-line-025x);
  min-width: calc(var(--base-line) + var(--base-line-05x));
  height: 2rem;
  padding: 0 var(--base-line-025x);
  border: 1px solid rgb(from var(--color-neutral) r g b);
  background-color: #fff;
  box-sizing: border-box;
  color: rgb(from var(--color-neutral) r g b);
  cursor: pointer;
  font: inherit;
  font-size: calc(14 / 16 * 1rem);
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: rgb(from var(--color-neutral) r g b / 10%);
    border-color: rgb(from var(--color-neutral) r g b);
    color: rgb(from var(--color-neutral) r g b);
  }

  &:focus-visible {
    outline: 4px solid var(--color-glow);
    border-radius: 4px;
    outline-offset: 0;
  }

  &[aria-pressed="true"] {
    background-color: rgb(from var(--color-loud) r g b / 10%);
    border-color: rgb(from var(--color-loud) r g b);
    color: rgb(from var(--color-loud) r g b);

    &:hover {
      background-color: rgb(from var(--color-loud) r g b / 20%);
      border-color: rgb(from var(--color-loud) r g b);
      color: rgb(from var(--color-loud) r g b);
    }
  }

  svg {
    width: var(--base-line);
    height: var(--base-line);
    flex-shrink: 0;
  }

  @container (max-width: 6rem) {
    & > svg {
      margin: auto;
    }

    & > span {
      display: none;
    }
  }
`;
