import styled from "@emotion/styled";
import { CodeBlock } from "react-code-block";

export const Container = styled.div`
  container-type: inline-size;
  width: 100%;

  @container (max-width: 525px) {
    & > div {
      padding-bottom: var(--base-line-15x);
    }
  }
`;

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  transition: transform 0.15s ease;
  display: flex;
  flex-flow: column;

  > [data-component="CopyButton"] {
    position: absolute;
    bottom: var(--base-line);
    right: var(--base-line);
  }

  > [data-component="CodeBlock"] {
    padding-top: 0;
  }
`;

export const Code = styled(CodeBlock.Code)`
  font-size: clamp(1rem, 3dvw, 1.5rem);
  margin: 0;
  padding: var(--base-line);
  box-sizing: border-box;
  overflow: auto;
  transition: opacity 0.15s ease;
  flex-grow: 1;
  direction: ltr;
`;

export const Line = styled.div`
  display: table-row;
`;

export const LineNumber = styled(CodeBlock.LineNumber)`
  display: table-cell;
  font-size: 1.5rem;
  padding-inline-end: 1rem;
  font-size: 0.875rem;
  text-align: right;
  user-select: none;
  color: var(--color-codesnippet-punctuation);
`;

export const LineContent = styled(CodeBlock.LineContent)`
  display: table-cell;
`;
