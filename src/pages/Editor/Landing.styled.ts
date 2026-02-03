import styled from "@emotion/styled";

export const LandingGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr minmax(20rem, 75rem) 1fr;
  grid-auto-rows: min-content;
  gap: 1rem;
  margin: 0;
  width: calc(100dvw);
  isolation: isolate;
`;
