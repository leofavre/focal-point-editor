import { type Dispatch, type SetStateAction, useEffect, useEffectEvent, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import useDebouncedEffect from "use-debounced-effect";
import type { UIRecord, UIState } from "../../types";

/**
 * Custom React hook for syncing a UI state value with IndexedDB persistence.
 * Retrieves the persisted value for the given id from the "ui" store (if available),
 * falls back to a provided default value, and writes updates (debounced).
 *
 * @returns A tuple: [value, setter] where value is the current state (or undefined initially),
 * and setter updates the state (and persists the value).
 */
export function usePersistedUIRecord<T extends keyof UIState>(
  { id, value: defaultValue }: UIRecord<T>,
  { debounceTimeout = 0 } = {},
): [UIState[T] | undefined, Dispatch<SetStateAction<UIState[T] | undefined>>] {
  const { getByID, update } = useIndexedDB("ui");
  const [value, setter] = useState<UIState[T]>();

  // All stable so updating them does not trigger a re-render nor database update.
  const stableIdGetter = useEffectEvent(() => id);
  const stableDefaultValueGetter = useEffectEvent(() => defaultValue);
  const stableGetById = useEffectEvent(getByID);
  const stableUpdate = useEffectEvent(update);

  // Initial load.
  useEffect(() => {
    stableGetById(stableIdGetter())
      .then((data) => {
        setter(data?.value ?? stableDefaultValueGetter());
      })
      .catch(() => {
        setter(stableDefaultValueGetter());
      });
  }, []);

  // Debounced database update.
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
