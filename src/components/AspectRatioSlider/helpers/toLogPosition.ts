/**
 * Converts an aspect ratio to a logarithmic position value between 0 and 1.
 *
 * This function maps an aspect ratio value within a given range [min, max] to a
 * position on a logarithmic scale. The logarithmic scale ensures that equal
 * multiplicative changes in aspect ratio correspond to equal changes in position,
 * which is useful for representing aspect ratios visually.
 *
 * @param ratio - The aspect ratio value to convert (must be between min and max)
 * @param min - The minimum aspect ratio value in the range
 * @param max - The maximum aspect ratio value in the range
 * @returns A position value between 0 and 1, where 0 corresponds to min and 1 corresponds to max
 */
export function toLogPosition(ratio: number, min: number, max: number) {
  return (Math.log(ratio) - Math.log(min)) / (Math.log(max) - Math.log(min));
}
