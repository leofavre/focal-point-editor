import type { ComponentPropsWithoutRef, ReactNode, Ref } from "react";

export type SiteTitleProps = {
  ref?: Ref<HTMLHeadingElement>;
  children?: ReactNode;
  to?: string;
} & ComponentPropsWithoutRef<"h1">;
