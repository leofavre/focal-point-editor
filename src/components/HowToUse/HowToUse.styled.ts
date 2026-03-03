import styled from "@emotion/styled";

export const Content = styled.div`
  box-sizing: border-box;

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
    font-size: calc(63 / 16 * 1rem);
    line-height: var(--base-line-3x);
    font-weight: 500;
    color: var(--color-loud);
    display: none;
  }

  h1 + p {
    font-size: calc(22 / 16 * 1rem);
    line-height: var(--base-line-15x);
    font-weight: 300;
    margin-top: var(--base-line-025x);
    margin-bottom: var(--base-line-2x);
    color: var(--color-neutral);
    display: none;
  }

  h2 {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }

  ol {
    container-type: inline-size;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(30ch, 1fr));
    row-gap: var(--base-line-05x);
    column-gap: var(--base-line-2x);
    box-sizing: border-box;
    width: 100%;

    & > li {
      display: grid;
      grid-template-columns: min-content auto;
      grid-template-rows: repeat(3, min-content);
      column-gap: var(--base-line-05x);

      > * {
        grid-column: 1 / -1;
      }
    }

    @container (max-width: 33rem) {
      & > li {
        > * {
          grid-column: auto;
        }

        > svg {
          align-self: end;
          width: var(--base-line-15x);
          height: var(--base-line-15x);
          margin-bottom: var(--base-line-025x);
        }

        > ul {
          grid-column: 2 / -1;
        }
      }
    }
  }

  li {
    list-style-type: none;
    text-wrap: balance;
    position: relative;
    display: flex;
  }

  ol > li > p {
    font-family: "Sono", monospace;
    font-optical-sizing: auto;
    font-size: calc(21 / 16 * 1rem);
    line-height: var(--base-line);
    font-weight: 300;
    text-transform: uppercase;
    word-spacing: -0.5ch;
    color: var(--color-neutral);
    display: flex;
    align-items: end;
    margin-bottom: var(--base-line-05x);
    min-height: var(--base-line-2x);
  }

  ul > li {
    font-size: calc(16 / 16 * 1rem);
    line-height: var(--base-line);
    font-weight: 400;
  }

  svg {
    width: var(--base-line-2x);
    height: var(--base-line-2x);
    color: var(--color-loud);
  }
`;
