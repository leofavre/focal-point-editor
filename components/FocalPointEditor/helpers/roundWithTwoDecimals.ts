/**
 * Rounds a number to two decimal places, avoiding floating‑point drift using `Number.EPSILON`.
 *
 * @param value - The number to round.
 * @returns The rounded value.
 */
export function roundWithTwoDecimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
