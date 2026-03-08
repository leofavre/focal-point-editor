import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { IndexedDBServiceContext } from "./indexedDBServiceContext";

type IndexedDBServiceProviderComponent = React.ComponentType<PropsWithChildren>;

/**
 * Wraps children with IndexedDBServiceContext. On the server and initial client
 * render, provides null so the app can SSR. After mount, dynamically loads
 * IndexedDBServiceProvider (which imports react-indexed-db-hook) and re-renders
 * with the real service, so the provider chunk never runs during SSR.
 */
export function IndexedDBServiceRoot({ children }: PropsWithChildren) {
  const [Provider, setProvider] = useState<IndexedDBServiceProviderComponent | null>(null);

  useEffect(() => {
    import("./IndexedDBServiceProvider").then((m) => {
      setProvider(() => m.IndexedDBServiceProvider);
    });
  }, []);

  if (Provider == null) {
    return (
      <IndexedDBServiceContext.Provider value={null}>{children}</IndexedDBServiceContext.Provider>
    );
  }

  return <Provider>{children}</Provider>;
}
