import styled from "@emotion/styled";

export const Slider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  /* Compensation so that the ruler snaps to the grid lines */
  margin-top: -12px;

  input {
    width: 100%;
    height: 1.375rem;
    background: transparent;
    border-radius: 0;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
    outline: none;

    /* Track styling - WebKit (Chrome, Safari, Edge) */
    &::-webkit-slider-runnable-track {
      width: 100%;
      height: 0.125rem;
      background: linear-gradient(
        to right,
        transparent 0%,
        transparent 0.46875rem,
        #94a3b8 0.46875rem,
        #94a3b8 calc(0.5rem + (100% - 1rem) * var(--initial-position)),
        #3b82f6 calc(0.5rem + (100% - 1rem) * var(--initial-position)),
        #3b82f6 calc(100% - 0.46875rem),
        transparent calc(100% - 0.46875rem),
        transparent 100%
      );
      border-radius: 0.0625rem;
    }

    /* Track styling - Firefox */
    &::-moz-range-track {
      width: 100%;
      height: 0.125rem;
      background: linear-gradient(
        to right,
        transparent 0%,
        transparent 0.46875rem,
        #94a3b8 0.46875rem,
        #94a3b8 calc(0.5rem + (100% - 1rem) * var(--initial-position)),
        #3b82f6 calc(0.5rem + (100% - 1rem) * var(--initial-position)),
        #3b82f6 calc(100% - 0.46875rem),
        transparent calc(100% - 0.46875rem),
        transparent 100%
      );
      border-radius: 0.0625rem;
      border: none;
    }

    /* Thumb styling - WebKit (Chrome, Safari, Edge) */
    &::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: 1rem;
      height: 1rem;
      background: rgba(255, 255, 255, 0.5);
      border: 0.125rem solid #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.2);
      margin-top: -0.4375rem;
      visibility: var(--thumb-visibility, hidden);
    }

    /* Thumb styling - Firefox */
    &::-moz-range-thumb {
      width: 1rem;
      height: 1rem;
      background: rgba(255, 255, 255, 0.5);
      border: 0.125rem solid #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.2);
      -moz-appearance: none;
      visibility: var(--thumb-visibility, hidden);
    }

    /* Thumb styling - iOS Safari */
    &::-webkit-slider-thumb:active {
      background: rgba(255, 255, 255, 0.5);
    }

    /* Thumb styling - Firefox active state */
    &::-moz-range-thumb:active {
      background: rgba(255, 255, 255, 0.5);
    }

    /* Focus styles */
    &:focus {
      outline: none;
    }

    &:focus::-webkit-slider-thumb {
      box-shadow: 0 0 0 0.1875rem rgba(59, 130, 246, 0.2);
    }

    &:focus::-moz-range-thumb {
      box-shadow: 0 0 0 0.1875rem rgba(59, 130, 246, 0.2);
    }
  }
`;
