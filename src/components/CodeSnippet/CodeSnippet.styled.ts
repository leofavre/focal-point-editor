import styled from "@emotion/styled";
import { CodeBlock } from "react-code-block";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  transition: transform 0.15s ease;
  display: flex;
  flex-flow: column;
`;

export const Code = styled(CodeBlock.Code)`
  font-size: 1.5rem;
  margin: 0;
  box-sizing: border-box;
  overflow: auto;
  transition: opacity 0.15s ease;
  flex-grow: 1;
`;

export const Line = styled.div`
  display: table-row;
`;

export const LineNumber = styled(CodeBlock.LineNumber)`
  display: table-cell;
  font-size: 1.5rem;
  padding-right: 1rem;
  font-size: 0.875rem;
  text-align: right;
  user-select: none;
  color: var(--color-codesnippet-punctuation);
`;

export const LineContent = styled(CodeBlock.LineContent)`
  display: table-cell;
`;
