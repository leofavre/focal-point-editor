import type { SVGProps } from "react";

export const IconCode = (props: SVGProps<SVGSVGElement>) => {
  return (
    /* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, hidden from screen readers */
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" aria-hidden {...props}>
      <path d="M6.39 16.43L2.5 10.97L7.39 5.52" stroke="currentColor" strokeWidth={2} />
      <path d="M12.25 4.83L9.75 16.7" stroke="currentColor" strokeWidth={2} />
      <path d="M15.61 5.52L19.5 10.97L14.61 16.43" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
};
