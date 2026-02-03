import styled from "@emotion/styled";
import { CodeBlock } from "react-code-block";

export const CodeWrapper = styled.div`
  position: relative;
  width: 100%;
  transition: all 0.15s ease;
`;

export const TabBar = styled.div`
  display: flex;
  gap: 0;
`;

export const TabButton = styled.button`
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-family: inherit;
  color: #9ca3af;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem 0.375rem 0 0;
  cursor: pointer;
  user-select: none;

  &[aria-selected="true"] {
    color: #e5e7eb;
    background-color: #111827;
    border: 1px solid #111827;
  }

  &:hover:not(:disabled) {
    color: #e5e7eb;
    background-color: #111827;
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
  }
`;

export const Code = styled(CodeBlock.Code)`
  font-size: 1rem;
  margin: 0;
  box-sizing: border-box;
  background-color: #111827;
  padding: 1.5rem;
  border-radius: 0 0rem 0rem 0.75rem;
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

export const CopyButton = styled.button`
  position: absolute;
  top: 2.5rem;
  right: 0.75rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
  font-family: inherit;
  color: #9ca3af;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  user-select: none;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;

  &:hover {
    color: #e5e7eb;
    background-color: #374151;
    border-color: #4b5563;
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
  }
`;
