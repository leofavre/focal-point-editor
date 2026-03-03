import type { SVGProps } from "react";

export const IconReference = (props: SVGProps<SVGSVGElement>) => {
  return (
    /* biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, hidden from screen readers */
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22" fill="none" aria-hidden {...props}>
      <path d="M11 2V5" stroke="currentColor" strokeWidth={2} />
      <path d="M2 11H5" stroke="currentColor" strokeWidth={2} />
      <path d="M11 20V17" stroke="currentColor" strokeWidth={2} />
      <path d="M20 11H17" stroke="currentColor" strokeWidth={2} />
      <path d="M11 12V10" stroke="currentColor" strokeWidth={2} />
      <path
        d="M16.7488 10.9893L11 5.2405L5.25122 10.9893L11 16.7381L13.8744 13.8637L16.7488 10.9893Z"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
};
