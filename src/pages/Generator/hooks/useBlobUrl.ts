import { useCallback, useRef } from "react";

/**
 * Manages a single object URL created from a Blob. Creates a new blob URL when requested
 * and revokes the previous one so only one URL is active at a time. Call revokeBlobUrl
 * on cleanup (e.g. in useEffect return or when switching source) to avoid leaks.
 *
 * @returns Object with createBlobUrl (creates and stores URL for the given Blob) and
 * revokeBlobUrl (revokes the current URL if any).
 */
export function useBlobUrl() {
  const blobUrlRef = useRef<string | null>(null);

  const createBlobUrl = useCallback((file: Blob) => {
    const blobUrl = URL.createObjectURL(file);
    blobUrlRef.current = blobUrl;
    return blobUrl;
  }, []);

  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current == null) return;
    URL.revokeObjectURL(blobUrlRef.current);
    blobUrlRef.current = null;
  }, []);

  return { createBlobUrl, revokeBlobUrl };
}
