/**
 * Returns `""` when the value is truthy, `null` when falsy.
 * Use for boolean data attributes so the attribute is present when true and omitted when false.
 */
export function parseBooleanAttr(prop: unknown): "" | null {
  return prop ? "" : null;
}
