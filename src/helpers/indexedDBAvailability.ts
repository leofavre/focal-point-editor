/**
 * Returns whether IndexedDB is available in the current environment.
 * IndexedDB can be undefined (e.g. in some tests or disabled browsers) or null
 * (e.g. Firefox private browsing).
 */
export function isIndexedDBAvailable(): boolean {
  return typeof window !== "undefined" && !!window.indexedDB;
}
