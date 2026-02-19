import styled from "@emotion/styled";

export const DialogWrapper = styled.dialog`
  border: none;
  padding: 0;
  margin: auto;
  box-sizing: border-box;
  background: none;
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 1fr min-content;
  gap: var(--base-line-05x);
  width: fit-content;
  height: 0px;
  max-width: 100%;
  max-height: 100%;
  min-height: fit-content;
  overflow: hidden;

  opacity: 0;

  &:not([open]) {
    display: none;
    opacity: 0;
  }

  &[open] {
    display: grid;
    opacity: 1;
    transition:
      opacity 132ms ease-in-out,
      display 132ms ease-in-out allow-discrete,
      overlay 132ms ease-in-out allow-discrete;
  }

  @starting-style {
    &[open] {
      opacity: 0;
    }
  }

  &::backdrop {
    background-color: rgba(0, 0, 0, 0);
  }

  &:not([open])::backdrop {
    background-color: rgba(0, 0, 0, 0);
  }

  &[open]::backdrop {
    background-color: var(--color-dialog-backdrop);
    transition:
      background-color 132ms ease-in-out,
      display 132ms ease-in-out allow-discrete,
      overlay 132ms ease-in-out allow-discrete;
  }

  @starting-style {
    &[open]::backdrop {
      background-color: rgba(0, 0, 0, 0);
    }
  }
`;

export const DialogButton = styled.button`
  grid-column: 2;
  grid-row: 1;
  appearance: none;
  border: none;
  padding: 0;
  margin: var(--base-line-05x);
  background: none;
  cursor: pointer;
  height: var(--base-line);
  color: var(--color-neutral);

  > svg {
    height: var(--base-line);
  }
`;

export const DialogContent = styled.div`
  grid-column: 1 / -1;
  grid-row: 2;
`;

export const DialogHeader = styled.div`
  grid-column: 1;
  grid-row: 1;
`;
