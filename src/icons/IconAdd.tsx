import type { SVGProps } from "react";

export const IconAdd = (props: SVGProps<SVGSVGElement>) => {
  return (
    /* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, hidden from screen readers */
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" aria-hidden {...props}>
      <path d="M12 6H5V16H17V11" stroke="currentColor" strokeWidth={2} />
      <path d="M14 6H20" stroke="currentColor" strokeWidth={2} />
      <path d="M16.995 9.005L16.995 3.005" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
};
