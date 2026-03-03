import styled from "@emotion/styled";

export const PrivacyPage = styled.article`
  grid-column: 1 / -1;
  grid-row: 1 / -2;
  margin: auto;
  padding: var(--base-line-2x);
  max-width: 48rem;
  width: 100%;
  box-sizing: border-box;

  h1 {
    font-size: calc(28 / 16 * 1rem);
    line-height: var(--base-line-2x);
    font-weight: 500;
    color: var(--color-loud);
    margin: 0 0 var(--base-line-2x) 0;
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
`;

export const PrivacyMeta = styled.p`
  font-size: calc(14 / 16 * 1rem);
  color: var(--color-neutral);
  margin-bottom: var(--base-line-2x);
`;
