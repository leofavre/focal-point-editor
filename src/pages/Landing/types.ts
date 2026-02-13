import type { ComponentPropsWithoutRef, Ref } from "react";
import type { Simplify } from "type-fest";

export type LandingProps = Simplify<
  {
    ref?: Ref<HTMLDivElement>;
  } & Omit<ComponentPropsWithoutRef<"div">, "ref">
>;
