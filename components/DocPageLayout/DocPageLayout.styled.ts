import styled from "@emotion/styled";

export const DocPageLayout = styled.article`
  grid-column: 1 / -1;
  grid-row: 2 / -2;
  margin: auto;
  padding: 0 var(--base-line);
  max-width: 48rem;
  width: 100%;
  box-sizing: border-box;

  h1 {
    font-size: calc(28 / 16 * 1rem);
    line-height: var(--base-line-2x);
    font-weight: 500;
    color: var(--color-loud);
  }

  h2 {
    font-size: calc(18 / 16 * 1rem);
    line-height: var(--base-line-15x);
    font-weight: 500;
    color: var(--color-body);
    margin: var(--base-line-2x) 0 var(--base-line-05x) 0;
  }

  p {
    font-size: calc(16 / 16 * 1rem);
    line-height: var(--base-line-15x);
    color: var(--color-neutral);
    margin: 0 0 var(--base-line-1x) 0;
  }

  p:last-child {
    margin-bottom: 0;
  }

  a {
    color: var(--color-cool);
    text-decoration: underline;
  }

  a:hover {
    color: var(--color-loud);
  }

  dl {
    margin: 0 0 var(--base-line-1x) 0;
  }

  dt {
    font-size: calc(16 / 16 * 1rem);
    font-weight: 500;
    color: var(--color-body);
    margin: var(--base-line-1x) 0 var(--base-line-05x) 0;
  }

  dt:first-of-type {
    margin-top: 0;
  }

  dd {
    font-size: calc(16 / 16 * 1rem);
    line-height: var(--base-line-15x);
    color: var(--color-neutral);
    margin: 0 0 0 1.5em;
  }
`;

/** Header row for doc pages: back button at inline-start, then title. */
export const DocPageHeader = styled.header`
  display: flex;
  align-items: center;
  gap: var(--base-line-1x);
  margin-bottom: var(--base-line-2x);
`;

/** Back button with arrow icon; icon flips in RTL so arrow points toward "back". */
export const DocPageBackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: var(--color-neutral);
  cursor: pointer;

  &:hover {
    color: var(--color-loud);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  :dir(rtl) svg {
    transform: scaleX(-1);
  }
`;

export const DocPageMeta = styled.p`
  font-size: calc(14 / 16 * 1rem);
  color: var(--color-neutral);
  margin-bottom: var(--base-line-2x);
`;

export const Kbd = styled.kbd`
  display: inline-block;
  padding: 0.15em 0.4em;
  font-family: inherit;
  font-size: 0.9em;
  color: var(--color-body);
  background: var(--color-subtle, #eee);
  border: 1px solid var(--color-border, #ccc);
  box-shadow: 0 1px 0 var(--color-border, #ccc);
`;
