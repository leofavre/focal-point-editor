import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const CellWrapper = styled.div`
  aspect-ratio: 1 / 1;
  overflow: hidden;
`;

export const CellLink = styled(Link)`
  display: block;
  width: 100%;
  height: 100%;
`;

export const CellImage = styled.img<{ $objectPosition?: string }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: ${(props) => props.$objectPosition ?? "50% 50%"};
  display: block;
`;
