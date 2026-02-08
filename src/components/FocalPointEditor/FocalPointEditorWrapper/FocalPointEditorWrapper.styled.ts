import styled from "@emotion/styled";

export const Container = styled.div`
  container-type: size;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  position: relative;
  touch-action: none;
  user-select: none;
  
  &::before {
    /** @see https://css-tip.com/corner-only-border-image */
    --s: 40px; /* the size on the corner */
    --t: var(--runner-thickness);  /* the thickness of the border */
    content: "";
    position: absolute;
    inset: calc(var(--t) * -1);
    border: var(--t) solid var(--color-neutral);
    z-index: 5;
    pointer-events: none;

    mask:
      conic-gradient(at var(--s) var(--s),#0000 75%,#000 0)
      0 0/calc(100% - var(--s)) calc(100% - var(--s)),
      linear-gradient(#000 0 0) content-box;
  }
`;
