import styled from "@emotion/styled";

export const LandingGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr minmax(20rem, 75rem) 1fr;
  grid-template-rows: min-content 1fr 5.625rem;
  gap: 1rem;
  margin: 1rem;

  [data-component="MosaicGrid"] {
    grid-column: 2;
    grid-row: 2;
  }

  [data-component="Title"] {
    grid-column: 2;
    grid-row: 1;
  }
`;

export const MosaicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
  grid-auto-rows: minmax(12.5rem, 1fr);
  gap: 1rem;
`;

export const Cell = styled.div`
  background-color: #fd4;
  aspect-ratio: 1 / 1;
`;

export const Title = styled.div``;
