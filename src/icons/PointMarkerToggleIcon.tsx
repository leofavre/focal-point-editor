export function PointMarkerToggleIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, button has title
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <line
        x1="12"
        y1="4"
        x2="12"
        y2="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="12"
        y1="16"
        x2="12"
        y2="20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="12"
        x2="8"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="12"
        x2="20"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
