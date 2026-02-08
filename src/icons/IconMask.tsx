import type { SVGProps } from "react";

export const IconMask = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      viewBox="0 0 22 22"
      aria-hidden
      {...props}
    >
      <title>Mask</title>
      <defs>
        <clipPath id="a" clipPathUnits="userSpaceOnUse">
          <path d="M0 16.5h16.5V0H0Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 22)">
        <path
          d="M9.262 4.875h-6.75v6.75h6.75z"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          strokeDasharray="none"
          strokeOpacity={1}
        />
      </g>
      <path
        d="M0 0h2.475v-2.475"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="matrix(1.33333 0 0 -1.33333 15.35 6.5)"
      />
      <path
        d="M0 0v-2.475h-2.475"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="matrix(1.33333 0 0 -1.33333 18.65 12.2)"
      />
    </svg>
  );
};
