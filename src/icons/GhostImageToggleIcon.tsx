export function GhostImageToggleIcon() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: Decorative icon, button has title
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <rect
        x="4"
        y="6"
        width="10"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        rx="1"
      />
      <rect
        x="10"
        y="6"
        width="10"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        rx="1"
        opacity="0.6"
      />
    </svg>
  );
}
