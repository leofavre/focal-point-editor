import styled from "@emotion/styled";

const VignetteContent = styled.div`
  background: linear-gradient(
    to bottom, #f0f0f0 0%, transparent 1rem, transparent calc(100% - 1rem), #f0f0f0 100%
  );
  pointer-events: none;
`;

export function Vignette() {
  return <VignetteContent data-component="Vignette" />;
}
