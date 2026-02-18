import styled from "@emotion/styled";

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--base-line);
  margin: var(--base-line);
  margin-top: 0;
  margin-bottom: 0;
  height: 100%;
  color: var(--color-neutral);

  label {
    display: flex;
  }

  input {
    margin: auto;
    margin-inline-end: var(--base-line-025x);
  }
`;
