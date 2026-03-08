import type { PageContext } from "vike/types";

/**
 * Catch-all for 404: matches any URL with lowest precedence so specific routes win.
 */
export function route(_pageContext: PageContext) {
  return { precedence: -1 };
}
