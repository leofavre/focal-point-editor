/**
 * Returns whether the body should have overflow hidden (class "no-overflow")
 * for the given pathname. Used by Vike bodyAttributes and by AppContext for
 * client-side updates when SSR is disabled or after navigation.
 */
export function shouldHideBodyOverflow(pathname: string): boolean {
  return pathname !== "/" && pathname !== "/privacy";
}
