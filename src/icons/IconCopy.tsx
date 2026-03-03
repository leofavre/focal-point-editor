import type { SVGProps } from "react";

export const IconCopy = (props: SVGProps<SVGSVGElement>) => {
  return (
    /* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, hidden from screen readers */
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" aria-hidden {...props}>
      <path d="M14 4H4V14H14V4Z" stroke="currentColor" strokeWidth={2} />
      <path d="M18 10V18H10" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
};
