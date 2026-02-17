import styled from "@emotion/styled";

/** Shared full-width message (loading, errors) in the main content area. */
export const LayoutMessage = styled.h3`
  grid-column: 1 / -1;
  grid-row: 1 / -2;
  margin: auto;
`;

export const LayoutGrid = styled.main`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 12ch) minmax(0, 12ch) minmax(8rem, 50rem) minmax(0, 12ch) minmax(0, 12ch) minmax(0, 1fr);
  grid-template-rows: 7rem 1fr 7rem;
  overflow: hidden;
  isolation: isolate;
  gap: var(--base-line-05x);
  margin: 0;
  width: 100dvw;
  min-height: 100dvh;

  [data-component="Landing"] {
    grid-column: 1 / -1;
    grid-row: 1 / -2;
    margin: auto;
  }

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
    width: clamp(25rem, 100dvw, 50rem);
    z-index: 2;
  }

  > [data-component="AspectRatioSlider"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 4;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    z-index: 1;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  > [data-component="FocalPointButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 2;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  > [data-component="ImageOverflowButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 3;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  > [data-component="CodeSnippetButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 5;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  > [data-component="ImageUploaderButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 6;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  &[data-has-bottom-bar] {
    > [data-component="AspectRatioSlider"],
    > [data-component="FocalPointButton"],
    > [data-component="ImageOverflowButton"],
    > [data-component="CodeSnippetButton"],
    > [data-component="ImageUploaderButton"] {
      top: 0;
      visibility: visible;
      transition: top 132ms ease-in-out 0s, visibility 132ms linear 0s;
    }
  }
`;
