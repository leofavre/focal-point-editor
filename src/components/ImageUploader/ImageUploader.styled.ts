import styled from "@emotion/styled";

export const InvisibleControl = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
`;

export const InvisibleForm = styled.form``;

export const InvisibleLabel = styled.label`
  display: contents;
`;
