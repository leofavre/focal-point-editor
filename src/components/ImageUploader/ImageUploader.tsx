import { type ChangeEvent, type FormEvent, useCallback, useEffectEvent } from "react";
import type { ImageDraftState } from "../../types";
import { Control, ImageUploaderForm } from "./ImageUploader.styled";
import type { ImageUploaderProps } from "./types";

export function ImageUploader({ ref, onImageUpload, ...rest }: ImageUploaderProps) {
  const stableOnImageUpload = useEffectEvent(
    (imageDraftState: ImageDraftState | null, file: File | null) => {
      onImageUpload?.(imageDraftState, file);
    },
  ) satisfies typeof onImageUpload;

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file?.type.startsWith("image/")) {
      stableOnImageUpload(null, null);
      return;
    }

    const imageDraftState: ImageDraftState = {
      name: file.name,
      type: file.type,
      createdAt: Date.now(),
      breakpoints: [],
    };

    stableOnImageUpload(imageDraftState, file);
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
