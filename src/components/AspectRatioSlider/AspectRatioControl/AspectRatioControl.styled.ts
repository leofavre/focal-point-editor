import styled from "@emotion/styled";

export const Slider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;

  input {
    margin: 0;
    padding: 0;
    width: 100%;
    height: calc(var(--thumb-diameter));
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
      height: var(--runner-thickness);
      background: linear-gradient(
        to right,
        transparent 0%,
        transparent calc(var(--thumb-radius)),
        #94a3b8 calc(var(--thumb-radius)),
        #94a3b8 calc(var(--thumb-radius) + (100% - var(--thumb-diameter)) * var(--thumb-initial-position)),
        #3b82f6 calc(var(--thumb-radius) + (100% - var(--thumb-diameter)) * var(--thumb-initial-position)),
        #3b82f6 calc(100% - var(--thumb-radius)),
        transparent calc(100% - var(--thumb-radius)),
        transparent 100%
      );
    }

    /* Track styling - Firefox */
    &::-moz-range-track {
      width: 100%;
      height: var(--runner-thickness);
      background: linear-gradient(
        to right,
        transparent 0%,
        transparent calc(var(--thumb-radius)),
        #94a3b8 calc(var(--thumb-radius)),
        #94a3b8 calc(var(--thumb-radius) + (100% - var(--thumb-diameter)) * var(--thumb-initial-position)),
        #3b82f6 calc(var(--thumb-radius) + (100% - var(--thumb-diameter)) * var(--thumb-initial-position)),
        #3b82f6 calc(100% - var(--thumb-radius)),
        transparent calc(100% - var(--thumb-radius)),
        transparent 100%
      );
    }

    /* Thumb styling - WebKit (Chrome, Safari, Edge) */
    &::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: var(--thumb-diameter);
      height: var(--thumb-diameter);
      background: rgba(255, 255, 255, 0.5);
      border: var(--thumb-border) solid #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 0.1875rem rgba(0, 0, 0, 0.2);
      margin-top: calc((var(--thumb-diameter) - var(--runner-thickness)) / -2);
      visibility: var(--thumb-visibility, hidden);
    }

    /* Thumb styling - Firefox */
    &::-moz-range-thumb {
      width: calc(var(--thumb-diameter) - var(--runner-thickness));
      height: calc(var(--thumb-diameter) - var(--runner-thickness));
      background: rgba(255, 255, 255, 0.5);
      border: var(--thumb-border) solid #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 0.1875rem rgba(0, 0, 0, 0.2);
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
