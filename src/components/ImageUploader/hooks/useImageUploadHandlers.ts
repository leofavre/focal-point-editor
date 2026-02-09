import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffectEvent } from "react";
import { processResults } from "../../../helpers/errorHandling";
import type { ImageDraftStateAndFile } from "../../../types";
import { processImageFilesWithErrorHandling } from "../helpers/processImageFilesWithErrorHandling";
import type { ImageUploaderProps } from "../types";

type UseImageUploadHandlersProps = Pick<ImageUploaderProps, "onImageUpload" | "onImagesUpload">;

export function useImageUploadHandlers({
  onImageUpload,
  onImagesUpload,
}: UseImageUploadHandlersProps) {
  const stableOnImageUpload = useEffectEvent((draftAndFile: ImageDraftStateAndFile | undefined) => {
    onImageUpload?.(draftAndFile);
  });

  const stableOnImagesUpload = useEffectEvent((draftsAndFiles: ImageDraftStateAndFile[]) => {
    onImagesUpload?.(draftsAndFiles);
  });

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { accepted, rejected } = processResults(
      processImageFilesWithErrorHandling(event.currentTarget?.files ?? null),
    );

    stableOnImageUpload(accepted[0]);
    stableOnImagesUpload(accepted);

    /**
     * @todo Maybe show error to the user in the UI.
     */
    rejected.forEach((error) => {
      console.error("Error uploading image:", error);
    });

    if (event.currentTarget == null) return;
    event.currentTarget.value = "";
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
