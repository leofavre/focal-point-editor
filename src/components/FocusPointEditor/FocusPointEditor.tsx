import type { PointerEvent } from "react";
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { ClippedImage } from "./ClippedImage/ClippedImage";
import { FocusPointEditorWrapper } from "./FocusPointEditorWrapper/FocusPointEditorWrapper";
import { GhostImage } from "./GhostImage/GhostImage";
import { clamp } from "./helpers/clamp";
import { cssObjectPositionObjectToString } from "./helpers/cssObjectPositionObjectToString";
import { cssObjectPositionStringToObject } from "./helpers/cssObjectPositionStringToObject";
import { getPointerCoordinatesFromEvent } from "./helpers/getPointerCoordinatesFromEvent";
import { scaleDimensionsToContainRect } from "./helpers/scaleDimensionToContainRect";
import { toPercentage } from "./helpers/toPercentage";
import { PointMarker } from "./PointMarker/PointMarker";
import type { Coordinates, FocusPointEditorProps, ImageDimensionDelta } from "./types";

const CURSOR_MAP = {
  width: "col-resize",
  height: "row-resize",
} as const;

const DELTA_DIMENSION_THRESHOLD_PX = 1;

export function FocusPointEditor({
  ref,
  imageUrl,
  aspectRatio,
  initialAspectRatio,
  objectPosition,
  showPointMarker,
  showGhostImage,
  onObjectPositionChange,
  onImageLoad,
  onImageError,
  ...rest
}: FocusPointEditorProps) {
  const [imageDimensionDelta, setImageDimensionDelta] = useState<ImageDimensionDelta | null>(null);

  const isDraggingRef = useRef(false);
  const objectPositionStartRef = useRef(objectPosition);
  const pointerCoordinatesStartRef = useRef<Coordinates | null>(null);

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
        const deltaWidthPx = width - rect.width;
        const deltaHeightPx = height - rect.height;
        const deltaWidthPercent = toPercentage(deltaWidthPx, width);
        const deltaHeightPercent = toPercentage(deltaHeightPx, height);

        const changedDimension =
          deltaWidthPx > DELTA_DIMENSION_THRESHOLD_PX
            ? "width"
            : deltaHeightPx > DELTA_DIMENSION_THRESHOLD_PX
              ? "height"
              : undefined;

        setImageDimensionDelta({
          width: { px: deltaWidthPx, percent: deltaWidthPercent },
          height: { px: deltaHeightPx, percent: deltaHeightPercent },
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
      pointerCoordinatesStartRef.current = getPointerCoordinatesFromEvent(event);
    },
    [objectPosition],
  );

  const stableOnObjectPositionChange = useEffectEvent(onObjectPositionChange);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current || imageDimensionDelta == null) return;

      const { x: pointerCoordinateX, y: pointerCoordinateY } =
        getPointerCoordinatesFromEvent(event);

      const pointerDeltaXPx = pointerCoordinateX - (pointerCoordinatesStartRef.current?.x ?? 0);
      const pointerDeltaYPx = pointerCoordinateY - (pointerCoordinatesStartRef.current?.y ?? 0);

      const objectPositionDeltaX =
        imageDimensionDelta.changedDimension === "width"
          ? clamp(toPercentage(pointerDeltaXPx, imageDimensionDelta.width.px), -100, 100)
          : 0;

      const objectPositionDeltaY =
        imageDimensionDelta.changedDimension === "height"
          ? clamp(toPercentage(pointerDeltaYPx, imageDimensionDelta.height.px), -100, 100)
          : 0;

      const { x: prevObjectPositionX, y: prevObjectPositionY } = cssObjectPositionStringToObject(
        objectPositionStartRef.current,
      );

      const nextObjectPosition = cssObjectPositionObjectToString({
        x: prevObjectPositionX - objectPositionDeltaX,
        y: prevObjectPositionY - objectPositionDeltaY,
      });

      stableOnObjectPositionChange(nextObjectPosition);
    },
    [imageDimensionDelta],
  );

  const handlePointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;

    const target = event.target as HTMLElement;
    target.releasePointerCapture(event.pointerId);
  }, []);

  const cursor =
    imageDimensionDelta?.changedDimension == null
      ? "crosshair"
      : CURSOR_MAP[imageDimensionDelta.changedDimension];

  const { x: objectPositionX, y: objectPositionY } =
    cssObjectPositionStringToObject(objectPosition);

  return (
    <FocusPointEditorWrapper
      aspectRatio={aspectRatio}
      cursor={cursor}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      {...rest}
    >
      <ClippedImage
        ref={ref}
        imageUrl={imageUrl}
        objectPosition={objectPosition}
        onImageLoad={onImageLoad}
        onImageError={onImageError}
      />
      <GhostImage
        css={{
          ...(imageDimensionDelta?.changedDimension === "width"
            ? { height: "100%" }
            : { width: "100%" }),
          transform: `translate(
            ${(objectPositionX ?? 0) * ((imageDimensionDelta?.width.percent ?? 0) / -100)}%,
            ${(objectPositionY ?? 0) * ((imageDimensionDelta?.height.percent ?? 0) / -100)}%
          )`,
          aspectRatio: initialAspectRatio,
          backgroundImage: `url(${imageUrl})`,
          opacity: showGhostImage ? 0.25 : 0,
          cursor,
        }}
        aria-hidden={!showGhostImage}
      />
      <PointMarker
        css={{
          opacity: showPointMarker ? 1 : 0,
          left: `${objectPositionX}%`,
          top: `${objectPositionY}%`,
        }}
        aria-hidden={!showPointMarker}
        onObjectPositionChange={stableOnObjectPositionChange}
      />
    </FocusPointEditorWrapper>
  );
}
