/**
 * Creates a keyboard event handler that maps keys (case-insensitive) to callbacks.
 *
 * Ignores events when Command (metaKey) or Control (ctrlKey) is pressed, so that
 * shortcuts like Cmd+C (copy) are not intercepted.
 *
 * The handler checks if the pressed key (case-insensitive) matches any key in the mapping,
 * and if so, calls the corresponding callback. The handler prevents default behavior
 * when a matching key is found.
 *
 * @returns A keyboard event handler function.
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
    if (event.metaKey || event.ctrlKey) return;

    const pressedKey = event.key.toLowerCase();
    const callback = normalizedKeyMap.get(pressedKey);

    if (callback) {
      event.preventDefault();
      callback();
    }
  };
}
