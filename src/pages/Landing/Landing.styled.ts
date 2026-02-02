import styled from "@emotion/styled";

export const LandingGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr minmax(20rem, 75rem) 1fr;
  grid-template-rows: min-content min-content 1fr 5.625rem;
  gap: 1rem;
  margin: 1rem;

  [data-component="ImageUploader"] {
    grid-column: 1 / -1;
  }

  [data-component="MosaicGrid"] {
    grid-column: 2;
    grid-row: 2;
  }

  [data-component="Title"] {
    grid-column: 2;
    grid-row: 1;
  }

  [data-component="Description"] {
    grid-column: 2;
    grid-row: 2;
  }

  [data-component="MosaicGrid"] {
    grid-row: 3;
  }
`;

export const Description = styled.p`
  margin: 0;
  max-width: 42rem;
  line-height: 1.5;
  color: #555;
  font-size: 1rem;

  code {
    font-family: ui-monospace, monospace;
    font-size: 0.9em;
    padding: 0.125em 0.35em;
    background: #e5e5e5;
    border-radius: 0.25em;
  }
`;

export const MosaicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
  grid-auto-rows: minmax(12.5rem, 1fr);
  gap: 1rem;
`;

export const Title = styled.div``;
