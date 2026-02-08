import { useCallback, useEffect, useRef, useState } from "react";
import { Overlay } from "./FullScreenDropZone.styled";
import { processImageFiles } from "./helpers/processImageFiles";
import { useImageUploadHandlers } from "./hooks/useImageUploadHandlers";
import type { ImageUploaderButtonProps } from "./types";

type FullScreenDropZoneProps = Pick<ImageUploaderButtonProps, "onImageUpload" | "onImagesUpload">;

export function FullScreenDropZone({ onImageUpload, onImagesUpload }: FullScreenDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  const { stableOnImageUpload, stableOnImagesUpload } = useImageUploadHandlers({
    onImageUpload,
    onImagesUpload,
  });

  /**
   * When a file is dropped, upload it and close the file manager.
   */
  const handleDrop = useCallback(
    async (event: DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragOver(false);

      const imageDraftStatesAndFiles = processImageFiles(event.dataTransfer?.files ?? null);
      await Promise.all([
        stableOnImageUpload(imageDraftStatesAndFiles[0]),
        stableOnImagesUpload(imageDraftStatesAndFiles),
      ]);
    },
    [stableOnImageUpload, stableOnImagesUpload],
  );

  /**
   * When a file is dragged over the drop zone, show the drop zone. Using counter avoids
   * showing the drop zone when a file is dragged over the drop zone multiple times.
   */
  useEffect(() => {
    const handleDragEnter = (event: DragEvent) => {
      event.preventDefault();
      dragCounterRef.current += 1;
      setIsDragOver(true);
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
    };

    const handleDragLeave = (event: DragEvent) => {
      if (event.relatedTarget != null && document.contains(event.relatedTarget as Node)) return;

      dragCounterRef.current -= 1;

      if (dragCounterRef.current > 0) return;

      dragCounterRef.current = 0;
      setIsDragOver(false);
    };

    const handleDropEffect = (event: DragEvent) => {
      handleDrop(event);
    };

    document.addEventListener("dragenter", handleDragEnter);
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDropEffect);

    return () => {
      document.removeEventListener("dragenter", handleDragEnter);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
      document.removeEventListener("drop", handleDropEffect);
    };
  }, [handleDrop]);

  if (!isDragOver) return null;

  return <Overlay data-component="FullScreenDropZone" aria-hidden />;
}
