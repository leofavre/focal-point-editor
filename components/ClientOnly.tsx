import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";

/**
 * Renders children only after the component has mounted (client-side).
 * Renders nothing during SSR and on the first client paint to avoid hydration
 * mismatches and to allow lazy-loaded children to load only on the client.
 */
export function ClientOnly({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <>{children}</>;
}
