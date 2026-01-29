/**
 * Creates a keyboard event handler that maps keys (case-insensitive) to callbacks.
 *
 * The handler checks if the pressed key (case-insensitive) matches any key in the mapping,
 * and if so, calls the corresponding callback. The handler prevents default behavior
 * when a matching key is found.
 *
 * @param keyMap - An object mapping key strings (case-insensitive) to callback functions.
 *   Multiple keys can map to the same callback.
 * @returns A keyboard event handler function.
 *
 * @example
 * ```ts
 * const handler = createKeyboardShortcutHandler({
 *   u: () => console.log("Upload triggered"),
 *   c: () => toggleCode(),
 *   d: () => toggleCode(), // Same action as 'c'
 * });
 *
 * // Use in JSX:
 * <div onKeyDown={handler} tabIndex={0}>
 *   ...
 * </div>
 * ```
 */
export function createKeyboardShortcutHandler(
  keyMap: Record<string, () => void>,
): (event: KeyboardEvent) => void {
  // Normalize keys to lowercase for case-insensitive matching
  const normalizedKeyMap = new Map<string, () => void>();

  for (const [key, callback] of Object.entries(keyMap)) {
    normalizedKeyMap.set(key.toLowerCase(), callback);
  }

  return (event: KeyboardEvent) => {
    const pressedKey = event.key.toLowerCase();
    const callback = normalizedKeyMap.get(pressedKey);

    if (callback) {
      event.preventDefault();
      callback();
    }
  };
}
