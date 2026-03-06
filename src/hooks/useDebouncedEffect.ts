import { type DependencyList, useEffect, useRef } from "react";

const DEFAULT_CONFIG = {
  timeout: 0,
  ignoreInitialCall: true,
} as const;

type DebouncedEffectConfig = {
  timeout?: number;
  ignoreInitialCall?: boolean;
};

type ResolvedConfig = {
  timeout: number;
  ignoreInitialCall: boolean;
};

export function useDebouncedEffect(
  callback: () => void,
  config: number | DebouncedEffectConfig,
  deps: DependencyList = [],
) {
  let currentConfig: ResolvedConfig;

  if (typeof config === "object") {
    currentConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  } else {
    currentConfig = {
      ...DEFAULT_CONFIG,
      timeout: config,
    };
  }

  const { timeout, ignoreInitialCall } = currentConfig;

  const data = useRef<{ firstTime: boolean; clearFunc?: () => void }>({
    firstTime: true,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: We need this for the hook to work
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { firstTime, clearFunc } = data.current;

    if (firstTime && ignoreInitialCall) {
      data.current.firstTime = false;
      return;
    }

    const handler = window.setTimeout(() => {
      if (clearFunc && typeof clearFunc === "function") {
        clearFunc();
      }

      const result = callback();

      if (typeof result === "function") {
        data.current.clearFunc = result;
      }
    }, timeout);

    return () => {
      window.clearTimeout(handler);
    };
  }, [timeout, ...deps]);
}

export default useDebouncedEffect;
