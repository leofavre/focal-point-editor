import { type ChangeEvent, type FormEvent, useCallback, useEffectEvent } from "react";
import type { ImageState } from "../../types";
import { Control, ImageUploaderForm } from "./ImageUploader.styled";
import type { ImageUploaderProps } from "./types";

export function ImageUploader({ ref, onImageUpload, ...rest }: ImageUploaderProps) {
  const stableOnImageUpload = useEffectEvent((imageState: ImageState | null, file: File | null) => {
    onImageUpload?.(imageState, file);
  }) satisfies typeof onImageUpload;

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file?.type.startsWith("image/")) {
      stableOnImageUpload(null, file ?? null);
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    let naturalAspectRatio: number;

    try {
      naturalAspectRatio = await getNaturalAspectRatioFromImageSrc(blobUrl);
    } catch (error) {
      console.error("Error loading image:", error);

      URL.revokeObjectURL(blobUrl);
      stableOnImageUpload(null, file);
      return;
    }

    const imageState: ImageState = {
      name: file.name,
      url: blobUrl,
      type: file.type,
      createdAt: Date.now(),
      naturalAspectRatio,
      breakpoints: [],
    };

    stableOnImageUpload(imageState, file);
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <ImageUploaderForm onSubmit={handleFormSubmit} noValidate {...rest}>
      <Control
        ref={ref}
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />
    </ImageUploaderForm>
  );
}

function getNaturalAspectRatioFromImageSrc(url: string) {
  return new Promise<number>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}
