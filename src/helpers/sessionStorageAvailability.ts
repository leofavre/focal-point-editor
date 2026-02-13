/**
 * Returns whether sessionStorage is available in the current environment.
 * sessionStorage can be undefined (e.g. in some tests or non-browser environments)
 * or throw in some private browsing modes (e.g. Safari).
 */
export function isSessionStorageAvailable(): boolean {
  return typeof window !== "undefined" && !!window.sessionStorage;
}
