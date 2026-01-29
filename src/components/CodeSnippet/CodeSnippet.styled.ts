import styled from "@emotion/styled";
import { CodeBlock } from "react-code-block";

export const Code = styled(CodeBlock.Code)`
  font-size: 1rem;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  background-color: #111827;
  padding: 1.5rem;
  border-radius: 0.75rem;
  overflow: auto;
  transition: opacity 0.15s ease;
`;

export const Line = styled.div`
  display: table-row;
`;

export const LineNumber = styled(CodeBlock.LineNumber)`
  display: table-cell;
  padding-right: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
  text-align: right;
  user-select: none;
`;

export const LineContent = styled(CodeBlock.LineContent)`
  display: table-cell;
`;
