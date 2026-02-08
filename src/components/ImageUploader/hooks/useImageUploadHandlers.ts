import { type ChangeEvent, type FormEvent, useCallback, useEffectEvent } from "react";
import type { ImageDraftStateAndFile } from "../../../types";
import { processImageFiles } from "../helpers/processImageFiles";
import type { ImageUploaderProps } from "../types";

type UseImageUploadHandlersProps = Pick<ImageUploaderProps, "onImageUpload" | "onImagesUpload">;

export function useImageUploadHandlers({
  onImageUpload,
  onImagesUpload,
}: UseImageUploadHandlersProps) {
  const stableOnImageUpload = useEffectEvent(
    async (draftAndFile: ImageDraftStateAndFile | undefined) => {
      await onImageUpload?.(draftAndFile);
    },
  );

  const stableOnImagesUpload = useEffectEvent(async (draftsAndFiles: ImageDraftStateAndFile[]) => {
    await onImagesUpload?.(draftsAndFiles);
  });

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      const imageDraftStatesAndFiles = processImageFiles(event.currentTarget.files);
      await Promise.all([
        stableOnImageUpload(imageDraftStatesAndFiles[0]),
        stableOnImagesUpload(imageDraftStatesAndFiles),
      ]);
    } finally {
      if (event.currentTarget != null) {
        event.currentTarget.value = "";
      }
    }
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return {
    handleFileChange,
    handleFormSubmit,
    stableOnImageUpload,
    stableOnImagesUpload,
  };
}
