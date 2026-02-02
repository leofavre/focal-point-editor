/**
 * Converts a boolean to a value suitable for a native `data-*` attribute. When truthy, returns
 * an empty string so the attribute is present; otherwise returns `undefined` so it is omitted.
 *
 * @returns `""` when `value` is truthy, `undefined` when falsy or `undefined`.
 */
export function parseBooleanDataAttribute(value: boolean | undefined): string | undefined {
  return value ? "" : undefined;
}
