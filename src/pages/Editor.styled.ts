import styled from "@emotion/styled";

export const EditorGrid = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1fr 1fr minmax(0, 50rem) 1fr 1fr minmax(0, 1fr);
  grid-template-rows: 7rem 1fr 7rem;
  overflow: hidden;
  isolation: isolate;
  gap: 0.5rem;
  margin: 0;
  width: 100dvw;
  height: 100dvh;

  [data-component="FocalPointEditor"] {
    grid-row: 1 / 3;
    grid-column: 1 / -1;
    overflow: hidden;
    z-index: 0;
  }

  [data-component="CodeSnippet"] {
    grid-row: 2 / 4;
    grid-column: 2 / -2;
    margin: auto auto 0 auto;
    max-width: 40rem;
    z-index: 2;
  }

  [data-component="AspectRatioSlider"] {
    grid-row: 3;
    grid-column: 4;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    z-index: 1;
  }

  [data-component="PointerMarkerButton"] {
    grid-row: 3;
    grid-column: 2;
  }

  [data-component="GhostImageButton"] {
    grid-row: 3;
    grid-column: 3;
  }

  [data-component="CodeSnippetButton"] {
    grid-row: 3;
    grid-column: 5;
  }

  [data-component="ImageUploaderButton"] {
    grid-row: 3;
    grid-column: 6;
  }

  [data-component="ImageUploader"] {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    margin: auto;
    max-width: 1200px;
  }
`;
