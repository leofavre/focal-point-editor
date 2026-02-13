import styled from "@emotion/styled";
import { CodeBlock } from "react-code-block";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  transition: transform 0.15s ease;
  display: flex;
  flex-flow: column;
`;

export const TabBar = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const TabButton = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.8125rem;
  font-family: inherit;
  color: #9ca3af;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem 0.375rem 0 0;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  &[aria-selected="true"] {
    color: #e5e7eb;
    background-color: #111827;
    border: 1px solid #111827;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      color: #e5e7eb;
      background-color: #111827;
    }
  }
  @media (hover: none) {
    &:active:not(:disabled) {
      color: #e5e7eb;
      background-color: #111827;
    }
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
  border-radius: 0 0.75rem 0 0;
  overflow: auto;
  transition: opacity 0.15s ease;
  flex-grow: 1;
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
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-family: inherit;
  color: #9ca3af;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;

  @media (hover: hover) {
    &:hover {
      color: #e5e7eb;
      background-color: #374151;
      border-color: #4b5563;
    }
  }
  @media (hover: none) {
    &:active {
      color: #e5e7eb;
      background-color: #374151;
      border-color: #4b5563;
    }
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
  }
`;
