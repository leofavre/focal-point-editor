import styled from "@emotion/styled";

export const List = styled.ul`
  position: relative;
  display: flex;
  margin: 0;
  align-items: flex-start;
  font-size: 0.75rem;
  color: #94a3b8;
`;

export const Item = styled.li`
  width: 1px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  writing-mode: sideways-lr;
`;

export const Label = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;

  &::after {
    content: "";
    margin-bottom: 0.25rem;
    display: inline-block;
    width: 1px;
    height: 1rem;
    background-color: #94a3b8;
    vertical-align: middle;
  }
`;
