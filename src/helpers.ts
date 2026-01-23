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

/**
 * Rounds a number to two decimal places, avoiding floating‑point drift using `Number.EPSILON`.
 *
 * @param value - The number to round.
 * @returns The rounded value.
 */
export function roundWithTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Computes `(a / b) * 100`. Returns `0` when `b` is `0` or less.
 *
 * @param a - The part (numerator).
 * @param b - The whole (denominator).
 * @returns The percentage, or `0` if `b <= 0`.
 */
export function toPercentage(a: number, b: number): number {
  return b > 0 ? (a / b) * 100 : 0;
}
