import styled from "@emotion/styled";

export const LandingWrapper = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto auto;
  padding: var(--base-line);
  padding-top: var(--base-line-2x);
  padding-left: var(--base-line-2x);
  gap: var(--base-line-2x);
  box-sizing: border-box;
  background-color: var(--color-zero);

  [data-component="ImageUploaderButton"] {
    width: calc(100% - var(--base-line));
    max-width: 16rem;
    grid-row: auto;
    grid-column: auto;
  }

  [data-component="HowToUse"] {
    padding: var(--base-line);
  }
`;
