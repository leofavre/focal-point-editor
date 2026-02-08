import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useCallback,
  useEffectEvent,
  useState,
} from "react";
import { parseBooleanDataAttribute } from "../../helpers/parseBooleanDataAttribute";
import type { ImageDraftStateAndFile } from "../../types";
import { processImageFiles } from "./helpers/processImageFiles";
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

  const stableOnImageUpload = useEffectEvent(
    async (draftAndFile: ImageDraftStateAndFile | undefined) => {
      await onImageUpload?.(draftAndFile);
    },
  ) satisfies typeof onImageUpload;

  const stableOnImagesUpload = useEffectEvent(async (draftsAndFiles: ImageDraftStateAndFile[]) => {
    await onImagesUpload?.(draftsAndFiles);
  }) satisfies typeof onImagesUpload;

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const imageDraftStatesAndFiles = processImageFiles(event.currentTarget.files);
      stableOnImageUpload(imageDraftStatesAndFiles[0]);
      stableOnImagesUpload(imageDraftStatesAndFiles);
    } finally {
      event.currentTarget.value = "";
    }
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

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

  const handleDrop = useCallback((event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
    const imageDraftStatesAndFiles = processImageFiles(event.dataTransfer.files);
    stableOnImageUpload(imageDraftStatesAndFiles[0]);
    stableOnImagesUpload(imageDraftStatesAndFiles);
  }, []);

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
