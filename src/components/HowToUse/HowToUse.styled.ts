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
    display: none;
  }

  h1 + p {
    display: none;
  }

  h2 {
    display: none;
  }

  ol {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(24ch, 1fr));
    gap: var(--base-line-2x);
    box-sizing: border-box;
  }

  li {
    list-style-type: none;
    text-wrap: balance;
    position: relative;
    display: flex;
    flex-direction: column;
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
