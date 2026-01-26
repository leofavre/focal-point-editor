import type { PointerMarkerProps } from "./types";

export function PointerMarker({ style }: PointerMarkerProps) {
  return (
    <div className="point-marker" style={style}>
      <img src="pointer-marker.svg" alt="Point marker" />
    </div>
  );
}
