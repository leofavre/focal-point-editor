import styled from "@emotion/styled";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background-color: rgb(from var(--color-neutral) r g b / 10%);
  transition: background-color 66ms ease;
`;
