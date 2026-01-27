import styled from "@emotion/styled";
import type { ChangeEvent } from "react";
import { useCallback, useEffectEvent, useMemo } from "react";
import { toAspectRatio, toPreciseAspectRatio } from "../helpers";
import type { AspectRatioControlProps } from "./types";

const Slider = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 100%;

  input {
    width: 100%;
    height: 22px;
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
      height: 2px;
      background: linear-gradient(
        to right,
        #94a3b8 0%,
        #94a3b8 var(--original-position),
        #3b82f6 var(--original-position),
        #3b82f6 100%
      );
      border-radius: 1px;
    }

    /* Track styling - Firefox */
    &::-moz-range-track {
      width: 100%;
      height: 2px;
      background: linear-gradient(
        to right,
        #94a3b8 0%,
        #94a3b8 var(--original-position),
        #3b82f6 var(--original-position),
        #3b82f6 100%
      );
      border-radius: 1px;
      border: none;
    }

    /* Thumb styling - WebKit (Chrome, Safari, Edge) */
    &::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: rgba(255, 255, 255, 0.5);
      border: 2px solid #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      margin-top: -7px;
    }

    /* Thumb styling - Firefox */
    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      background: rgba(255, 255, 255, 0.5);
      border: 2px solid #3b82f6;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
      -moz-appearance: none;
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
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    &:focus::-moz-range-thumb {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
    }
  }
`;

export function AspectRatioControl({
  ref,
  aspectRatio,
  aspectRatioList,
  onAspectRatioChange,
  ...rest
}: AspectRatioControlProps) {
  const stableOnAspectRatioChange = useEffectEvent((aspectRatio: number) => {
    onAspectRatioChange?.(aspectRatio);
  });

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const aspectRatio = toAspectRatio(parseInt(event.target.value, 10));
    stableOnAspectRatioChange(aspectRatio);
  }, []);

  const originalPosition = useMemo(() => {
    const min = aspectRatioList.at(0)?.preciseValue ?? 1;
    const max = aspectRatioList.at(-1)?.preciseValue ?? 1;
    const original = aspectRatioList.find((item) => item.name === "original");

    if (!original) return 0;

    return ((original.preciseValue - min) / (max - min)) * 100;
  }, [aspectRatioList]);

  return (
    <Slider {...rest} css={{ "--original-position": `${originalPosition}%` }}>
      <input
        ref={ref}
        type="range"
        step={1}
        min={aspectRatioList.at(0)?.preciseValue}
        max={aspectRatioList.at(-1)?.preciseValue}
        value={toPreciseAspectRatio(aspectRatio ?? 1)}
        onChange={handleChange}
        list="aspect-ratio"
      />
      <datalist id="aspect-ratio">
        {aspectRatioList.map(({ preciseValue }) => (
          <option key={preciseValue} value={preciseValue} />
        ))}
      </datalist>
    </Slider>
  );
}
