/**
 * Converts a logarithmic position value (0-1) back to an aspect ratio.
 *
 * This is the inverse function of `toLogPosition`. It takes a position on a
 * logarithmic scale and converts it back to the corresponding aspect ratio value
 * within the specified range [min, max].
 *
 * @param position - The logarithmic position value between 0 and 1
 * @param min - The minimum aspect ratio value in the range
 * @param max - The maximum aspect ratio value in the range
 * @returns The aspect ratio value corresponding to the given position
 */
export function toAspectRatio(position: number, min: number, max: number) {
  return Math.exp(position * (Math.log(max) - Math.log(min)) + Math.log(min));
}
