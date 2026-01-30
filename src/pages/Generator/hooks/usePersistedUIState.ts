import { type Dispatch, type SetStateAction, useEffect, useEffectEvent, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import useDebouncedEffect from "use-debounced-effect";
import type { UIRecord, UIState } from "../types";

export function usePersistedUIState<T extends keyof UIState>(
  { id, value: defaultValue }: UIRecord<T>,
  { debounceTimeout = 0 } = {},
): [UIState[T] | undefined, Dispatch<SetStateAction<UIState[T] | undefined>>] {
  const { getByID, update } = useIndexedDB("ui");
  const [value, setter] = useState<UIState[T]>();

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
