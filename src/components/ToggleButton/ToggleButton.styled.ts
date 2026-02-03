import styled from "@emotion/styled";

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 0.0625rem solid #9ca3af;
  border-radius: 0.375rem;
  background-color: #fff;
  color: #374151;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: #f3f4f6;
    border-color: #6b7280;
    color: #111827;
  }

  &[aria-pressed="true"] {
    background-color: #dbeafe;
    border-color: #3b82f6;
    color: #1d4ed8;

    &:hover {
      background-color: #bfdbfe;
      border-color: #2563eb;
      color: #1e40af;
    }
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;
