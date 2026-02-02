import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useCallback,
  useEffectEvent,
  useState,
} from "react";
import { parseBooleanDataAttribute } from "../../helpers/parseBooleanDataAttribute";
import { CloudUploadIcon } from "../../icons/CloudUploadIcon";
import { processImageFiles } from "./helpers/processImageFiles";
import {
  BrowseButton,
  DropZone,
  HiddenControl,
  IconWrapper,
  ImageUploaderContainer,
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
    const imageDraftStatesAndFiles = processImageFiles(event.currentTarget.files);
    stableOnImageUpload(imageDraftStatesAndFiles);
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
    const imageDraftStatesAndFiles = processImageFiles(event.dataTransfer.files);
    stableOnImageUpload(imageDraftStatesAndFiles);
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <ImageUploaderContainer {...rest}>
      <ImageUploaderForm
        onSubmit={handleFormSubmit}
        noValidate
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-drag-over={parseBooleanDataAttribute(isDragOver)}
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
    </ImageUploaderContainer>
  );
}
