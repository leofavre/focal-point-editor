import styled from "@emotion/styled";

export const EditorGrid = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 1fr 1fr minmax(0, 50rem) 1fr 1fr minmax(0, 1fr);
  grid-template-rows: 5.625rem 1fr 5.625rem;
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
    grid-column: 6;
  }

  [data-component="ImageUploader"][data-variant="small"] {
    grid-row: 3;
    grid-column: 5;
    margin-bottom: auto;
  }

  [data-component="ImageUploader"][data-variant="large"] {
    grid-column: 3 / 6;
    grid-row: 2;
    margin: auto;
    max-width: 1200px;
  }
`;

export const IntroContent = styled.div`
  --base-line: 22;
  display: contents;

  & > div {
    display: contents;
  }

  h1,
  h2,
  p,
  ol,
  ul,
  li {
    margin: 0;
    padding: 0;
  }

  h1 {
    display: none;
  }

  h1 + p {
    display: none;
  }

  h2 {
    display: none;
  }

  ol {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(22ch, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 60rem;
  }

  li {
    list-style-type: none;
    text-wrap: balance;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  ol > li {
    padding-top: calc((var(--base-line) * 2) / 16 * 1rem);
  }

  ol > li > p {
    font-family: "Sono", monospace;
    font-optical-sizing: auto;
    font-size: calc(21 / 16 * 1rem);
    line-height: calc(var(--base-line) / 16 * 1rem);
    font-weight: 300;
    text-transform: uppercase;
    word-spacing: -0.5ch;
    color: var(--color-neutral);
    display: flex;
    align-items: end;
    margin-bottom: calc((var(--base-line) / 2) / 16 * 1rem);
    min-height: calc((var(--base-line) * 2) / 16 * 1rem);
  }

  ul > li {
    font-size: calc(16 / 16 * 1rem);
    line-height: calc(var(--base-line) / 16 * 1rem);
    font-weight: 400;
  }

  svg {
    width: calc((var(--base-line) * 2) / 16 * 1rem);
    height: calc((var(--base-line) * 2) / 16 * 1rem);
    color: var(--color-loud);
  }
`;
