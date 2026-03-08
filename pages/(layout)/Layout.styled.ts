import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/** CSS-only loading spinner. */
export const LoadingSpinner = styled.span`
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: ${spin} 0.8s linear infinite;
`;

/** Shared full-width message (loading, errors) in the main content area. */
export const LayoutMessage = styled.h3`
  grid-column: 1 / -1;
  grid-row: 1 / -2;
  margin: auto;
`;

/** Header row; display: contents so title and privacy link are laid out on the main grid. */
export const LayoutHeader = styled.header`
  display: contents;
`;

/** Link to privacy notice; positioned on the main grid, same column as title, aligned top/end. */
export const PrivacyLink = styled.a`
  grid-row: 1;
  grid-column: 2 / -2;
  align-self: start;
  justify-self: end;
  margin-top: var(--base-line-05x);
  z-index: 10;
  font-size: calc(14 / 16 * 1rem);
  color: var(--color-neutral);
  text-decoration: none;

  &:hover {
    color: var(--color-loud);
  }
`;

/** Wrapper for bottom bar controls; display: contents preserves parent grid layout. */
export const EditorControlsNav = styled.nav`
  display: contents;
`;

export const LayoutGrid = styled.main`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 12ch) minmax(0, 12ch) minmax(8rem, 50rem) minmax(0, 12ch) minmax(0, 12ch) minmax(0, 1fr);
  grid-template-rows: 7rem 1fr auto;
  overflow: hidden;
  gap: var(--base-line-05x);
  margin: 0;
  width: 100dvw;
  min-height: 100dvh;

  [data-component="Landing"] {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    margin: auto;

    width: 100%;
    max-width: 80rem;
  }

  [data-component="FocalPointEditor"] {
    grid-row: 1 / 3;
    grid-column: 1 / -1;
    overflow: hidden;
  }

  [data-component="CodeSnippet"] {
    grid-row: 2 / 4;
    grid-column: 2 / -2;
    margin: auto auto 0 auto;
    width: clamp(25rem, 100dvw, 40rem);
  }

  [data-component="EditorControlsNav"] [data-component="AspectRatioSlider"],
  > [data-component="AspectRatioSlider"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 4;
    margin-left: auto;
    margin-right: auto;
    max-width: 1200px;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  [data-component="EditorControlsNav"] [data-component="FocalPointButton"],
  > [data-component="FocalPointButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 2;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  [data-component="EditorControlsNav"] [data-component="ImageOverflowButton"],
  > [data-component="ImageOverflowButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 3;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  [data-component="EditorControlsNav"] [data-component="CodeSnippetButton"],
  > [data-component="CodeSnippetButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 5;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  [data-component="EditorControlsNav"] [data-component="ImageUploaderButton"],
  > [data-component="ImageUploaderButton"] {
    position: relative;
    top: 8rem;
    grid-row: 3;
    grid-column: 6;
    margin-bottom: auto;
    visibility: hidden;
    transition: top 132ms ease-in-out 0s, visibility 132ms linear 132ms;
  }

  [data-component="ImageUploaderButton"] {
    z-index: 8;
  }

  [data-component="FocalPoint"] {
    z-index: 5;
  }

  [data-component="HowToUse"] {
    z-index: 3;
  }

  &[data-has-bottom-bar] {
    [data-component="EditorControlsNav"] [data-component="AspectRatioSlider"],
    [data-component="EditorControlsNav"] [data-component="FocalPointButton"],
    [data-component="EditorControlsNav"] [data-component="ImageOverflowButton"],
    [data-component="EditorControlsNav"] [data-component="CodeSnippetButton"],
    [data-component="EditorControlsNav"] [data-component="ImageUploaderButton"] {
      top: 0;
      visibility: visible;
      transition: top 132ms ease-in-out 0s, visibility 132ms linear 0s;
    }
  }
`;
