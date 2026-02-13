import type { Dispatch, SetStateAction } from "react";
import { useEffect, useEffectEvent, useState } from "react";
import useDebouncedEffect from "use-debounced-effect";
import { isSessionStorageAvailable } from "../../helpers/sessionStorageAvailability";
import { getInMemoryStorageService } from "../../services/inMemoryStorageService";
import { getSessionStorageService } from "../../services/sessionStorageService";
import type { UIRecord, UIState } from "../../types";

export type UsePersistedUIRecordOptions = {
  debounceTimeout?: number;
  /** When true, use in-memory storage instead of sessionStorage (e.g. for ephemeral mode). */
  forceInMemoryStorage?: boolean;
};

export type UsePersistedUIRecordReturn<K extends keyof UIState> = [
  UIState[K] | undefined,
  Dispatch<SetStateAction<UIState[K] | undefined>>,
];

/**
 * Custom React hook for syncing a UI state value with sessionStorage or in-memory storage.
 * Retrieves the persisted value for the given id from the "ui" store (if available),
 * falls back to a provided default value, and writes updates (debounced).
 * Uses storage services: getRecord returns a Result; failures are handled by falling back to the default value.
 *
 * Storage: sessionStorage when available (unless forceInMemoryStorage is true), else in-memory.
 *
 * @returns A tuple: [value, setter] where value is the current state (or undefined initially),
 * and setter updates the state (and persists the value).
 */
export function usePersistedUIRecord<K extends keyof UIState>(
  { id, value: defaultValue }: UIRecord<K>,
  { debounceTimeout = 0, forceInMemoryStorage = false }: UsePersistedUIRecordOptions = {},
): UsePersistedUIRecordReturn<K> {
  const useSessionStorage = !forceInMemoryStorage && isSessionStorageAvailable();
  const service = useSessionStorage
    ? getSessionStorageService<UIRecord<K>>("ui")
    : getInMemoryStorageService<UIRecord<K>>("ui");

  const [value, setter] = useState<UIState[K]>();

  const stableIdGetter = useEffectEvent(() => id);
  const stableDefaultValueGetter = useEffectEvent(() => defaultValue);
  const stableServiceGetRecord = useEffectEvent(service.getRecord);

  // Initial load: unwrap Result from getRecord.
  useEffect(() => {
    const load = async () => {
      const result = await stableServiceGetRecord(stableIdGetter());
      if (result.rejected != null) {
        setter(stableDefaultValueGetter());
        return;
      }
      setter(result.accepted?.value ?? stableDefaultValueGetter());
    };
    load();
  }, []);

  // Debounced database update.
  useDebouncedEffect(
    () => {
      if (value == null) return;
      void service.updateRecord({ id: stableIdGetter(), value });
    },
    { timeout: debounceTimeout },
    [value],
  );

  return [value, setter];
}
