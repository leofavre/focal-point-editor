import type { SVGProps } from "react";

export const IconMask = (props: SVGProps<SVGSVGElement>) => {
  return (
    /* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, hidden from screen readers */
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" aria-hidden {...props}>
      <path d="M13 6H3V16H13V11V6Z" stroke="currentColor" strokeWidth={2} />
      <path d="M16 6H19V10" stroke="currentColor" strokeWidth={2} />
      <path d="M19 12V16H16" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
};
