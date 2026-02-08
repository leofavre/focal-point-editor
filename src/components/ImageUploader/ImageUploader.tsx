import { type DragEvent, useCallback, useState } from "react";
import { parseBooleanDataAttribute } from "../../helpers/parseBooleanDataAttribute";
import { processImageFiles } from "./helpers/processImageFiles";
import { useImageUploadHandlers } from "./hooks/useImageUploadHandlers";
import { DropZone, Form, InvisibleControl } from "./ImageUploader.styled";
import type { ImageUploaderProps } from "./types";

export function ImageUploader({
  ref,
  onImageUpload,
  onImagesUpload,
  children,
  ...rest
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const { handleFileChange, handleFormSubmit, stableOnImageUpload, stableOnImagesUpload } =
    useImageUploadHandlers({ onImageUpload, onImagesUpload });

  const handleDragOver = useCallback((event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (event: DragEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);

      const imageDraftStatesAndFiles = processImageFiles(event.dataTransfer.files);
      await Promise.all([
        stableOnImageUpload(imageDraftStatesAndFiles[0]),
        stableOnImagesUpload(imageDraftStatesAndFiles),
      ]);
    },
    [stableOnImageUpload, stableOnImagesUpload],
  );

  return (
    <Form
      data-component="ImageUploader"
      data-drag-over={parseBooleanDataAttribute(isDragOver)}
      onSubmit={handleFormSubmit}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      {...rest}
    >
      {children}
      <DropZone htmlFor="image-upload"></DropZone>
      <InvisibleControl
        ref={ref}
        id="image-upload"
        type="file"
        accept="image/*"
        multiple={onImagesUpload != null}
        onChange={handleFileChange}
      />
    </Form>
  );
}
