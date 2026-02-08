import {
  type ChangeEvent,
  type FormEvent,
  forwardRef,
  useCallback,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { useMergeRefs } from "react-merge-refs";
import { IconUpload } from "../../icons/IconUpload";
import type { ImageDraftStateAndFile } from "../../types";
import { ToggleButton } from "../ToggleButton/ToggleButton";
import { processImageFiles } from "./helpers/processImageFiles";
import { InvisibleControl, InvisibleForm, InvisibleLabel } from "./ImageUploader.styled";
import type { ImageUploaderButtonProps } from "./types";

export const ImageUploaderButton = forwardRef<HTMLInputElement, ImageUploaderButtonProps>(
  function ImageUploaderButton({ onImageUpload, onImagesUpload }, forwardedRef) {
    const inputRef = useRef<HTMLInputElement>(null);
    const mergedRefs = useMergeRefs([inputRef, forwardedRef]);

    const [isUploading, setIsUploading] = useState(false);

    const stableOnImageUpload = useEffectEvent(
      async (draftAndFile: ImageDraftStateAndFile | undefined) => {
        await onImageUpload?.(draftAndFile);
      },
    ) satisfies typeof onImageUpload;

    const stableOnImagesUpload = useEffectEvent(
      async (draftsAndFiles: ImageDraftStateAndFile[]) => {
        await onImagesUpload?.(draftsAndFiles);
      },
    ) satisfies typeof onImagesUpload;

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

    return (
      <InvisibleForm onSubmit={handleFormSubmit}>
        <InvisibleLabel>
          <InvisibleControl
            ref={mergedRefs}
            type="file"
            accept="image/*"
            multiple={onImagesUpload != null}
            onChange={handleFileChange}
            tabIndex={-1}
          />
          <ToggleButton
            data-component="ImageUploaderButton"
            type="button"
            toggled={isUploading}
            onToggle={(toggled) => setIsUploading(!toggled)}
            onClick={() => inputRef.current?.click()}
            titleOn="Upload"
            titleOff="Upload"
            icon={<IconUpload />}
          />
        </InvisibleLabel>
      </InvisibleForm>
    );
  },
);
