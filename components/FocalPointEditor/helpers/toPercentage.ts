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
