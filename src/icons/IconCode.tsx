import type { SVGProps } from "react";

export const IconCode = (props: SVGProps<SVGSVGElement>) => {
  return (
    /** biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, hidden from screen readers */
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      viewBox="0 0 22 22"
      aria-hidden
      {...props}
    >
      <defs>
        <clipPath id="a" clipPathUnits="userSpaceOnUse">
          <use xlinkHref="#reuse-0" />
        </clipPath>
        <clipPath id="b" clipPathUnits="userSpaceOnUse">
          <use xlinkHref="#reuse-0" />
        </clipPath>
        <path id="reuse-0" d="M0 16.5h16.5V0H0Z" />
      </defs>
      <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 22)">
        <path
          d="m0 0-2.919 4.094L.75 8.187"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          strokeDasharray="none"
          strokeOpacity={1}
          transform="translate(4.794 4.175)"
        />
      </g>
      <path
        d="m0 0-1.877-8.901"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="matrix(1.33333 0 0 -1.33333 12.251 4.833)"
      />
      <g clipPath="url(#b)" transform="matrix(1.33333 0 0 -1.33333 0 22)">
        <path
          d="m0 0 2.919-4.094L-.75-8.187"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          strokeDasharray="none"
          strokeOpacity={1}
          transform="translate(11.706 12.363)"
        />
      </g>
    </svg>
  );
};
