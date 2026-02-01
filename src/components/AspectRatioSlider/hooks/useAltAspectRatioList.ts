import { useMemo } from "react";
import { toLogPosition } from "../helpers/toLogPosition";
import type { AspectRatio } from "../types";

type PartialAspectRatio = Omit<AspectRatio, "position">;

const ASPECT_RATIO_MAP: Record<string, number> = {
  "9:16": 9 / 16,
  "4:5": 4 / 5,
  "5:7": 5 / 7,
  "3:4": 3 / 4,
  "3:5": 3 / 5,
  "2:3": 2 / 3,
  "1:1": 1 / 1,
  "3:2": 3 / 2,
  "5:3": 5 / 3,
  "4:3": 4 / 3,
  "7:5": 7 / 5,
  "5:4": 5 / 4,
  "16:9": 16 / 9,
  "4:1": 4 / 1,
};

const ASPECT_RATIO_LIST: PartialAspectRatio[] = Object.entries(ASPECT_RATIO_MAP)
  .map(([name, value]) => ({
    name,
    value,
  }))
  .sort((a, b) => a.value - b.value);

const POSITION_REPLACEMENT_THRESHOLD = 1 / 50;

export function useAltAspectRatioList(originalAspectRatioValue?: number): AspectRatio[] {
  return useMemo(() => {
    const initialMinValue = ASPECT_RATIO_LIST[0].value;
    const initialMaxValue = ASPECT_RATIO_LIST[ASPECT_RATIO_LIST.length - 1].value;

    const original: PartialAspectRatio | undefined = originalAspectRatioValue
      ? { name: "original", value: originalAspectRatioValue }
      : undefined;

    const minValue = Math.min(
      initialMinValue,
      originalAspectRatioValue ?? Number.POSITIVE_INFINITY,
    );

    const maxValue = Math.max(
      initialMaxValue,
      originalAspectRatioValue ?? Number.NEGATIVE_INFINITY,
    );

    return [...ASPECT_RATIO_LIST, ...(original ? [original] : [])]
      .sort((a, b) => a.value - b.value)
      .map((partialAspectRatio) => ({
        ...partialAspectRatio,
        position: toLogPosition(partialAspectRatio.value, minValue, maxValue),
      }))
      .filter(({ name, value }) => {
        return (
          original != null &&
          ((name === original.name && value === original.value) ||
            value < original.value - POSITION_REPLACEMENT_THRESHOLD ||
            value > original.value + POSITION_REPLACEMENT_THRESHOLD)
        );
      });
  }, [originalAspectRatioValue]);
}
