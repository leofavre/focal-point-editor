import type { ComponentProps, ForwardRefExoticComponent } from "react";
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
import type { ImageDraftStateAndFile } from "../../types";
import { SmallButton as SmallButtonComponent } from "../SmallButton";
import { processImageFiles } from "./helpers/processImageFiles";
import {
  BrowseButton,
  DropZone,
  Form,
  HiddenControl,
  IconWrapper,
  InstructionText,
  OrDivider,
} from "./ImageUploader.styled";
import type { ImageUploaderProps } from "./types";

const SmallButton = SmallButtonComponent as unknown as ForwardRefExoticComponent<
  ComponentProps<typeof SmallButtonComponent> & {
    htmlFor: string;
  }
>;

export function ImageUploader({
  ref,
  onImageUpload,
  onImagesUpload,
  variant,
  ...rest
}: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const stableOnImageUpload = useEffectEvent((draftAndFile: ImageDraftStateAndFile | undefined) => {
    onImageUpload?.(draftAndFile);
  }) satisfies typeof onImageUpload;

  const stableOnImagesUpload = useEffectEvent((draftsAndFiles: ImageDraftStateAndFile[]) => {
    onImagesUpload?.(draftsAndFiles);
  }) satisfies typeof onImagesUpload;

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const imageDraftStatesAndFiles = processImageFiles(event.currentTarget.files);
    stableOnImageUpload(imageDraftStatesAndFiles[0]);
    stableOnImagesUpload(imageDraftStatesAndFiles);
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
    stableOnImageUpload(imageDraftStatesAndFiles[0]);
    stableOnImagesUpload(imageDraftStatesAndFiles);
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <Form
      data-component="ImageUploader"
      data-variant={variant}
      data-drag-over={parseBooleanDataAttribute(isDragOver)}
      onSubmit={handleFormSubmit}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      noValidate
      {...rest}
    >
      <HiddenControl
        ref={ref}
        id="image-upload"
        type="file"
        accept="image/*"
        multiple={onImagesUpload != null}
        onChange={handleFileChange}
      />
      {variant === "large" ? (
        <DropZone htmlFor="image-upload">
          <IconWrapper>
            <CloudUploadIcon />
          </IconWrapper>
          <InstructionText>Drag and Drop images here</InstructionText>
          <OrDivider>Or</OrDivider>
          <BrowseButton>Browse images</BrowseButton>
        </DropZone>
      ) : (
        <SmallButton as="label" htmlFor="image-upload">
          <CloudUploadIcon />
        </SmallButton>
      )}
    </Form>
  );
}
