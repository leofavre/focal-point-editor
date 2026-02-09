import type { Dispatch, SetStateAction } from "react";
import { useEffect, useEffectEvent, useState } from "react";
import useDebouncedEffect from "use-debounced-effect";
import { getIndexedDBService } from "../../services/indexedDBService";
import { getSessionStorageService } from "../../services/sessionStorageService";
import type { UIRecord, UIState } from "../../types";

/**
 * Custom React hook for syncing a UI state value with IndexedDB persistence.
 * Retrieves the persisted value for the given id from the "ui" store (if available),
 * falls back to a provided default value, and writes updates (debounced).
 *
 * @returns A tuple: [value, setter] where value is the current state (or undefined initially),
 * and setter updates the state (and persists the value).
 */
export function usePersistedUIRecord<K extends keyof UIState>(
  { id, value: defaultValue }: UIRecord<K>,
  {
    debounceTimeout = 0,
    service = "indexedDB",
  }: {
    debounceTimeout?: number;
    service?: "sessionStorage" | "indexedDB";
  } = {},
): [UIState[K] | undefined, Dispatch<SetStateAction<UIState[K] | undefined>>] {
  const { getRecord, updateRecord } =
    service === "indexedDB"
      ? getIndexedDBService<UIRecord<K>>("ui")
      : getSessionStorageService<UIRecord<K>>("ui");

  const [value, setter] = useState<UIState[K]>();

  // All stable so updating them does not trigger re-renders nor database updates.
  const stableIdGetter = useEffectEvent(() => id);
  const stableDefaultValueGetter = useEffectEvent(() => defaultValue);

  const stableGetRecord = useEffectEvent(getRecord);
  const stableUpdateRecord = useEffectEvent(updateRecord);

  // Initial load.
  useEffect(() => {
    stableGetRecord(stableIdGetter())
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
      stableUpdateRecord({ id: stableIdGetter(), value: value });
    },
    { timeout: debounceTimeout },
    [value],
  );

  return [value, setter];
}
