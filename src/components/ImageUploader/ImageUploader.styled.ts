import styled from "@emotion/styled";

export const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--base-line-1x);
  background-color: rgb(from var(--color-neutral) r g b / 5%);
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
  cursor: pointer;
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 2 / 1;

  * {
    cursor: pointer;
  }

  &[data-drag-over] {
    background-color: rgb(from var(--color-neutral) r g b / 10%);
  }
  

  [data-component="HowToUse"] {
    padding-left: var(--base-line-2x);
    width: 100%;
    max-width: 60rem;
  }
`;

export const DropZone = styled.label`
  position: absolute;
  inset: 0;
`;

export const HiddenControl = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
`;
