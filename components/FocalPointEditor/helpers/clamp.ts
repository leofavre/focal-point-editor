/**
 * Clamps a numeric value between a minimum and maximum (inclusive).
 *
 * @param value - The value to clamp.
 * @param min - The lower bound.
 * @param max - The upper bound.
 * @returns The clamped value, or `min` / `max` if `value` is outside the range.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(value, min));
}
