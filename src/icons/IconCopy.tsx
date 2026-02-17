import type { SVGProps } from "react";

export const IconCopy = (props: SVGProps<SVGSVGElement>) => {
  return (
    /* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, hidden from screen readers */
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      viewBox="0 0 22 22"
      aria-hidden
      {...props}
    >
      {/* Outer L: +2px right and down from rect, then whole icon centered in 22×22 */}
      <path
        d="M 17.5 7 L 17.5 19 L 8.5 19"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
      {/* Inner: 3:4 aspect ratio (9×12) */}
      <path
        d="M 4.5 3 L 13.5 3 L 13.5 15 L 4.5 15 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeMiterlimit={10}
      />
    </svg>
  );
};
