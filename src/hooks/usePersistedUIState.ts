import type { Dispatch, SetStateAction } from "react";
import { useEffect, useEffectEvent, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import useDebouncedEffect from "use-debounced-effect";

/**
 * A React hook that manages UI state persisted in IndexedDB.
 *
 * This hook provides state management with automatic persistence to IndexedDB.
 * On mount, it attempts to load the persisted value from IndexedDB. If no value
 * exists or loading fails, it falls back to the provided default value.
 * Whenever the state changes, it automatically saves the new value to IndexedDB,
 * optionally after a debounce delay.
 *
 * @template T - The type of the state value.
 *
 * @param options - Configuration options for the hook.
 * @param options.id - A unique identifier used as the key in IndexedDB. This should
 *   be unique across all persisted UI states in the application.
 * @param options.defaultValue - The default value to use if no persisted value exists
 *   or if loading from IndexedDB fails.
 * @param options.debounceTimeout - Delay in milliseconds before persisting state
 *   changes to IndexedDB. When `0` (default), persistence runs immediately after
 *   each change. When greater than `0`, rapid updates are coalesced and only the
 *   latest value is persisted after the delay.
 *
 * @returns A tuple containing:
 *   - `value`: The current state value (may be `undefined` during initial load).
 *   - `setter`: A state setter function compatible with React's `useState` setter.
 *
 * @remarks
 * - The hook uses the "ui" store in IndexedDB.
 * - The value may be `undefined` during the initial load from IndexedDB.
 * - State updates are persisted to IndexedDB after the optional debounce delay.
 * - If IndexedDB operations fail, the hook gracefully falls back to the default value.
 * - The passed `id` and `defaultValue` properties are kept stable across re-renders.
 *   They can only be set once.
 *
 * @example
 * ```tsx
 * const [showCodeSnippet, setShowCodeSnippet] = usePersistedUIState({
 *   id: "showCodeSnippet",
 *   defaultValue: false,
 * });
 *
 * // Use the state
 * <ToggleButton
 *   toggled={showCodeSnippet ?? false}
 *   onToggle={() => setShowCodeSnippet((prev) => !prev)}
 * />
 * ```
 *
 * @example
 * With debounce for frequently changing state (e.g. slider):
 * ```tsx
 * const [aspectRatio, setAspectRatio] = usePersistedUIState({
 *   id: "aspectRatio",
 *   defaultValue: 1,
 *   debounceTimeout: 300,
 * });
 * ```
 */
export function usePersistedUIState<T>({
  id,
  defaultValue,
  debounceTimeout = 0,
}: {
  id: string;
  defaultValue: T;
  debounceTimeout?: number;
}): [T | undefined, Dispatch<SetStateAction<T | undefined>>] {
  const { getByID, update } = useIndexedDB("ui");
  const [value, setter] = useState<T>();

  const stableIdGetter = useEffectEvent(() => id);
  const stableDefaultValueGetter = useEffectEvent(() => defaultValue);
  const stableGetById = useEffectEvent(getByID);
  const stableUpdate = useEffectEvent(update);

  useEffect(() => {
    stableGetById(stableIdGetter())
      .then((data) => {
        setter(data?.value ?? stableDefaultValueGetter());
      })
      .catch(() => {
        setter(stableDefaultValueGetter());
      });
  }, []);

  useDebouncedEffect(
    () => {
      if (value == null) return;
      stableUpdate({ id: stableIdGetter(), value: value });
    },
    { timeout: debounceTimeout },
    [value],
  );

  return [value, setter];
}
