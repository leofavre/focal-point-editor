import styled from "@emotion/styled";

export const ToggleBar = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const EditorGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr minmax(20rem, 75rem) 1fr;
  grid-template-rows: min-content 1fr 5.625rem;
  gap: 1rem;
  margin: 1rem;
  width: calc(100dvw - 2rem);
  height: calc(100dvh - 2rem);
  overflow: hidden;

  [data-component="ImageUploader"] {
    grid-row: 1;
    grid-column: 2;
    margin-right: auto;
    min-width: 15ch;

    &:nth-child(1):nth-last-child(1) {
      grid-row: 1 / 4;
      grid-column: 2;
      margin: auto;
      width: 100%;
      height: 100%;
      max-width: 60rem;
      max-height: 40rem;
    }

    z-index: 1;
  }

  [data-component="ToggleBar"] {
    grid-row: 1;
    grid-column: 2;
    margin-left: auto;
    z-index: 1;
  }

  [data-component="FocusPointEditor"] {
    grid-row: 1 / 3;
    grid-column: 2;
    z-index: 0;
  }

  [data-component="CodeSnippet"] {
    grid-row: 2;
    grid-column: 1 / 4;
    margin: auto 0 auto auto;
    max-width: 650px;
    z-index: 2;
  }

  [data-component="AspectRatioSlider"] {
    grid-row: 3;
    grid-column: 2;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    z-index: 1;
  }
`;
