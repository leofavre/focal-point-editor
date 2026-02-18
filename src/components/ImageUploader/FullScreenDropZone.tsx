import { Overlay } from "./FullScreenDropZone.styled";
import { useImageDropzone } from "./hooks/useImageDropzone";
import type { FullScreenDropZoneProps } from "./types";

export function FullScreenDropZone({
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
  ...rest
}: FullScreenDropZoneProps) {
  const { getRootProps, getInputProps, isDragGlobal } = useImageDropzone({
    onImageUpload,
    onImagesUpload,
    onImageUploadError,
    onImagesUploadError,
    noClick: true,
    noDrag: false,
    multiple: true,
  });

  if (!isDragGlobal) return null;

  return (
    <Overlay
      {...getRootProps()}
      data-component="FullScreenDropZone"
      aria-hidden
      style={{ pointerEvents: "auto" }}
      {...rest}
    >
      <input {...getInputProps()} aria-hidden />
    </Overlay>
  );
}
