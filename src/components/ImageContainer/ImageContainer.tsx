import clsx from "clsx";
import type { PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CURSOR_MAP, DEFAULT_OBJECT_POSITION } from "./constants";
import { coordinatesToCssObjectPosition } from "./helpers/coordinatesToCssObjectPosition";
import { cssObjectPositionToCoordinates } from "./helpers/cssObjectPositionToCoordinates";
import { detectProportionalImageHeight } from "./helpers/detectRelativeImageSize";
import { getPointerCoordinatesFromEvent } from "./helpers/getPointerPositionFromEvent";
import { scaleDimensionsToContainRect } from "./helpers/scaleDimensionToContainRect";
import type { Coordinates, ImageContainerProps, ImageObserved } from "./types";

const DELTA_DIMENSION_THRESHOLD = 1;

export function ImageContainer({
  ref,
  aspectRatio,
  naturalAspectRatio,
  imageUrl,
  onImageLoad,
  onImageError,
  className,
  ...rest
}: ImageContainerProps) {
  const [objectPosition, setObjectPosition] = useState<string>(DEFAULT_OBJECT_POSITION);
  const [imageObserved, setImageObserved] = useState<ImageObserved | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const objectPositionStartRef = useRef<string>(DEFAULT_OBJECT_POSITION);
  const pointerPositionStartRef = useRef<Coordinates | null>(null);

  useEffect(() => {
    if (ref.current == null || imageUrl == null) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const source = {
          width: ref.current?.naturalWidth ?? 1,
          height: ref.current?.naturalHeight ?? 1,
        };

        const rect = entry.contentRect;

        const { width, height } = scaleDimensionsToContainRect({ source, rect });
        const deltaWidth = width - rect.width;
        const deltaHeight = height - rect.height;

        const changedDimension =
          deltaWidth > DELTA_DIMENSION_THRESHOLD
            ? "width"
            : deltaHeight > DELTA_DIMENSION_THRESHOLD
              ? "height"
              : undefined;

        setImageObserved({
          deltaWidth,
          deltaHeight,
          changedDimension,
        });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [imageUrl, ref]);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      isDraggingRef.current = true;

      const target = event.target as HTMLElement;
      target.setPointerCapture(event.pointerId);

      objectPositionStartRef.current = objectPosition;
      pointerPositionStartRef.current = getPointerCoordinatesFromEvent({ event });
    },
    [objectPosition],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current || imageObserved == null) return;

      const pointerPosition = getPointerCoordinatesFromEvent({ event });

      const deltaX = pointerPosition.x - (pointerPositionStartRef.current?.x ?? 0);
      const deltaY = pointerPosition.y - (pointerPositionStartRef.current?.y ?? 0);
      const deltaXPercent = (deltaX / imageObserved.deltaWidth) * 100;
      const deltaYPercent = (deltaY / imageObserved.deltaHeight) * 100;
      const maybeDeltaXPercent = imageObserved.changedDimension === "width" ? deltaXPercent : 0;
      const maybeDeltaYPercent = imageObserved.changedDimension === "height" ? deltaYPercent : 0;

      const prevObjectPosition = cssObjectPositionToCoordinates(objectPositionStartRef.current);

      const nextObjectPosition = coordinatesToCssObjectPosition({
        x: prevObjectPosition.x - maybeDeltaXPercent,
        y: prevObjectPosition.y - maybeDeltaYPercent,
      });

      setObjectPosition(nextObjectPosition);
    },
    [imageObserved],
  );

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;

    const target = event.target as HTMLElement;
    target.releasePointerCapture(event.pointerId);
  }, []);

  const cursor =
    imageObserved?.changedDimension == null
      ? "crosshair"
      : CURSOR_MAP[imageObserved.changedDimension];

  /** @todo Understand, fix and rename */
  const moo = cssObjectPositionToCoordinates(objectPosition);

  return (
    <div
      className={clsx("touch-none select-none", className)}
      style={{
        aspectRatio: aspectRatio ?? "auto",
        height: `${detectProportionalImageHeight({ aspectRatio }) ?? 0}vmin`,
        cursor,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      {...rest}
    >
      <div className="w-full h-full relative overflow-hidden border border-gray-300 pointer-events-none touch-none select-none">
        <img
          ref={ref}
          src={imageUrl}
          className="w-full h-full object-cover touch-none select-none"
          style={{ objectPosition }}
          onLoad={onImageLoad}
          onError={onImageError}
          aria-label="Image uploaded by the user"
        />
        <svg
          aria-hidden="true"
          className="absolute top-0 left-0 w-full h-full pointer-events-none touch-none select-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 1000 ${1000 / (naturalAspectRatio ?? 1)}`}
          preserveAspectRatio="xMidYMid slice"
        >
          <line
            x1={`${moo.x}%`}
            y1="0"
            x2={`${moo.x}%`}
            y2="100%"
            stroke="black"
            stroke-width="1"
            stroke-dasharray="4 4"
            vector-effect="non-scaling-stroke"
          />
          <line
            x1="0"
            y1={`${moo.y}%`}
            x2="100%"
            y2={`${moo.y}%`}
            stroke="black"
            stroke-width="1"
            stroke-dasharray="4 4"
            vector-effect="non-scaling-stroke"
          />
        </svg>
      </div>
    </div>
  );
}
