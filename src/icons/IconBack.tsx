import type { SVGProps } from "react";

/**
 * Left-pointing arrow (back in LTR). Use CSS `transform: scaleX(-1)` in
 * `:dir(rtl)` so it points right (back in RTL).
 */
export const IconBack = (props: SVGProps<SVGSVGElement>) => {
  return (
    /* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, parent has accessible label */
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden
      {...props}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
};
