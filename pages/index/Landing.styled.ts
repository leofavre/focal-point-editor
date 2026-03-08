import styled from "@emotion/styled";

export const LandingWrapper = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  padding: var(--base-line-2x);
  padding-inline-end: var(--base-line);
  gap: var(--base-line-2x);
  box-sizing: border-box;
  touch-action: none;

  [data-component="ImageUploaderButton"] {
    grid-row: auto;
    grid-column: auto;
  }
`;
