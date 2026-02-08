import { useRef, useState } from "react";
import { useMergeRefs } from "react-merge-refs";
import { IconUpload } from "../../icons/IconUpload";
import { ToggleButton } from "../ToggleButton/ToggleButton";
import { useImageUploadHandlers } from "./hooks/useImageUploadHandlers";
import { InvisibleControl, InvisibleForm, InvisibleLabel } from "./ImageUploader.styled";
import type { ImageUploaderButtonProps } from "./types";

export function ImageUploaderButton({
  ref,
  onImageUpload,
  onImagesUpload,
  ...rest
}: ImageUploaderButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mergedRefs = useMergeRefs([ref, buttonRef]) as typeof buttonRef;

  const [openedByButton, setOpenedByButton] = useState(false);

  const { handleFileChange, handleFormSubmit } = useImageUploadHandlers({
    onImageUpload,
    onImagesUpload,
  });

  return (
    <InvisibleForm onSubmit={handleFormSubmit}>
      <InvisibleLabel>
        <InvisibleControl
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={onImagesUpload != null}
          onChange={handleFileChange}
          onClick={() => {
            setOpenedByButton(document.activeElement === buttonRef.current);
          }}
          tabIndex={-1}
        />
        <ToggleButton
          ref={mergedRefs}
          data-component="ImageUploaderButton"
          type="button"
          toggled={openedByButton}
          onClick={() => {
            inputRef?.current?.click();
          }}
          onFocus={() => {
            if (openedByButton) {
              setOpenedByButton(false);
            }
          }}
          titleOn="Upload"
          titleOff="Upload"
          icon={<IconUpload />}
          {...rest}
        />
      </InvisibleLabel>
    </InvisibleForm>
  );
}
