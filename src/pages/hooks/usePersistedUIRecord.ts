import type { Dispatch, SetStateAction } from "react";
import { useEffect, useEffectEvent, useState } from "react";
import useDebouncedEffect from "use-debounced-effect";
import { resultFromPromise } from "../../helpers/errorHandling";
import { getIndexedDBService } from "../../services/indexedDBService";
import { getSessionStorageService } from "../../services/sessionStorageService";
import type { UIRecord, UIState } from "../../types";

const noopGetRecord = async (): Promise<undefined> => undefined;
const noopUpdateRecord = async (): Promise<void> => {};

export type UsePersistedUIRecordOptions = {
  debounceTimeout?: number;
  service?: "sessionStorage" | "indexedDB";
};

export type UsePersistedUIRecordReturn<K extends keyof UIState> = [
  UIState[K] | undefined,
  Dispatch<SetStateAction<UIState[K] | undefined>>,
];

/**
 * Custom React hook for syncing a UI state value with IndexedDB or sessionStorage.
 * Retrieves the persisted value for the given id from the "ui" store (if available),
 * falls back to a provided default value, and writes updates (debounced).
 * Uses a Result-based approach: getRecord failures and sessionStorage unavailability
 * are handled by falling back to the default value.
 *
 * @returns A tuple: [value, setter] where value is the current state (or undefined initially),
 * and setter updates the state (and persists the value).
 */
export function usePersistedUIRecord<K extends keyof UIState>(
  { id, value: defaultValue }: UIRecord<K>,
  { debounceTimeout = 0, service = "indexedDB" }: UsePersistedUIRecordOptions = {},
): UsePersistedUIRecordReturn<K> {
  // Call both so hook order is stable (getIndexedDBService uses useIndexedDB).
  const indexedDBResult = getIndexedDBService<UIRecord<K>>("ui");
  const sessionStorageResult = getSessionStorageService<UIRecord<K>>("ui");

  const { getRecord, updateRecord } =
    service === "indexedDB"
      ? indexedDBResult.rejected != null
        ? { getRecord: noopGetRecord, updateRecord: noopUpdateRecord }
        : indexedDBResult.accepted
      : sessionStorageResult.rejected != null
        ? { getRecord: noopGetRecord, updateRecord: noopUpdateRecord }
        : sessionStorageResult.accepted;

  const [value, setter] = useState<UIState[K]>();

  // All stable so updating them does not trigger re-renders nor database updates.
  const stableIdGetter = useEffectEvent(() => id);
  const stableDefaultValueGetter = useEffectEvent(() => defaultValue);

  const stableGetRecord = useEffectEvent(getRecord);
  const stableUpdateRecord = useEffectEvent(updateRecord);

  // Initial load: Result-based so we handle getRecord failure without throw.
  useEffect(() => {
    const load = async () => {
      const result = await resultFromPromise(
        stableGetRecord(stableIdGetter()),
        "GetUIRecordFailed",
      );
      /**
       * @todo Maybe show error to the user in the UI.
       */
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
      stableUpdateRecord({ id: stableIdGetter(), value: value });
    },
    { timeout: debounceTimeout },
    [value],
  );

  return [value, setter];
}
