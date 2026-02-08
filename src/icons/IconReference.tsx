import type { SVGProps } from "react";

export const IconReference = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      viewBox="0 0 22 22"
      aria-hidden
      {...props}
    >
      <title>Reference</title>
      <defs>
        <clipPath id="a" clipPathUnits="userSpaceOnUse">
          <path d="M0 16.5h16.5V0H0Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 22)">
        <path
          d="M0 0v-2.25"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          strokeDasharray="none"
          strokeOpacity={1}
          transform="translate(8.25 15)"
        />
        <path
          d="M0 0h2.25"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          strokeDasharray="none"
          strokeOpacity={1}
          transform="translate(1.5 8.25)"
        />
        <path
          d="M0 0v2.25"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          strokeDasharray="none"
          strokeOpacity={1}
          transform="translate(8.25 1.5)"
        />
        <path
          d="M0 0h-2.25"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit={10}
          strokeDasharray="none"
          strokeOpacity={1}
          transform="translate(15 8.25)"
        />
      </g>
      <path
        d="M0 0v1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="matrix(1.33333 0 0 -1.33333 11 12)"
      />
      <path
        d="m0 0-4.312 4.312L0 8.625l4.312-4.313Z"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        strokeDasharray="none"
        strokeOpacity={1}
        transform="matrix(1.33333 0 0 -1.33333 11 16.75)"
      />
    </svg>
  );
};
