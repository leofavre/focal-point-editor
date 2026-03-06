import type { PageContext } from "vike/types";
import { shouldHideBodyOverflow } from "@/src/helpers/shouldHideBodyOverflow";

export default function bodyAttributes(pageContext: PageContext): Record<string, string> {
  const pathname = pageContext.urlPathname ?? "";
  return shouldHideBodyOverflow(pathname) ? { class: "no-overflow" } : {};
}
