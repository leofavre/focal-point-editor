import type { SVGProps } from "react";

export const IconClose = (props: SVGProps<SVGSVGElement>) => {
  return (
    /* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, hidden from screen readers */
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" aria-hidden {...props}>
      <path d="M17 17L5 5" stroke="currentColor" strokeWidth={2} />
      <path d="M17 5L5 17" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
};
