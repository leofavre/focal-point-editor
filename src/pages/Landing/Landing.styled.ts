import styled from "@emotion/styled";

export const LandingWrapper = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  padding: var(--base-line-2x);
  padding-right: var(--base-line);
  gap: var(--base-line-2x);
  box-sizing: border-box;
  background-color: var(--color-zero);

  [data-component="ImageUploaderButton"] {
    width: calc(100% - var(--base-line));
    grid-row: auto;
    grid-column: auto;
  }
`;
