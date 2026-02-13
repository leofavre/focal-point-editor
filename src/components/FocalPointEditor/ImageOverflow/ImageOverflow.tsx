import styled from "@emotion/styled";

export const ImageOverflow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #c1c5ce;
  transition: opacity 66ms ease;
  opacity: 0.5;
  z-index: -1;
`;
