import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useCallback,
  useEffectEvent,
  useState,
} from "react";
import { CloudUploadIcon } from "../../icons/CloudUploadIcon";
import type { ImageDraftState } from "../../types";
import {
  BrowseButton,
  DropZone,
  HiddenControl,
  IconWrapper,
  ImageUploaderForm,
  InstructionText,
  OrDivider,
} from "./ImageUploader.styled";
import type { ImageDraftStateAndFile, ImageUploaderProps } from "./types";

export function ImageUploader({ ref, onImageUpload, ...rest }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const stableOnImageUpload = useEffectEvent((event: ImageDraftStateAndFile[]) => {
    onImageUpload?.(event);
  }) satisfies typeof onImageUpload;

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    processImageFiles(event.currentTarget.files, stableOnImageUpload);
    event.currentTarget.value = "";
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
    processImageFiles(event.dataTransfer.files, stableOnImageUpload);
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <ImageUploaderForm
      onSubmit={handleFormSubmit}
      noValidate
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-drag-over={parseBooleanDataAttribute(isDragOver)}
      {...rest}
    >
      <HiddenControl
        ref={ref}
        id="image-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <DropZone htmlFor="image-upload">
        <IconWrapper>
          <CloudUploadIcon />
        </IconWrapper>
        <InstructionText>Drag and Drop images here</InstructionText>
        <OrDivider>Or</OrDivider>
        <BrowseButton>Browse images</BrowseButton>
      </DropZone>
    </ImageUploaderForm>
  );
}

function processImageFiles(
  files: FileList | null,
  onUpload: (result: ImageDraftStateAndFile[]) => void,
): void {
  if (files == null || files.length === 0) return;

  const result: ImageDraftStateAndFile[] = [];

  for (const file of Array.from(files)) {
    if (!file.type.startsWith("image/")) continue;

    const imageDraftState: ImageDraftState = {
      name: file.name,
      type: file.type,
      createdAt: Date.now(),
      breakpoints: [],
    };

    result.push({ imageDraftState, file });
  }

  if (result.length > 0) {
    onUpload(result);
  }
}

function parseBooleanDataAttribute(value: boolean | undefined): string | undefined {
  return value ? "" : undefined;
}
