import type { ChangeEvent } from "react";
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useMergeRefs } from "react-merge-refs";
import { IconUpload } from "../../icons/IconUpload";
import { ToggleButton } from "../ToggleButton/ToggleButton";
import { useImageUploadHandlers } from "./hooks/useImageUploadHandlers";
import { InvisibleControl, InvisibleForm, InvisibleLabel } from "./ImageUploader.styled";
import type { ImageUploaderButtonProps } from "./types";

export function ImageUploaderButton({
  ref,
  size = "small",
  onImageUpload,
  onImagesUpload,
  ...rest
}: ImageUploaderButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mergedRefs = useMergeRefs([ref, buttonRef]);

  const [isOpened, setIsOpened] = useState(false);

  const { handleFileChange, handleFormSubmit } = useImageUploadHandlers({
    onImageUpload,
    onImagesUpload,
  });

  const stableInputRefGetter = useEffectEvent(() => inputRef.current);
  const stableHandleFileChange = useEffectEvent(handleFileChange);
  const setClosed = useEffectEvent(() => setIsOpened(false));

  /**
   * When a file is selected, upload it and close the file manager.
   */
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    stableHandleFileChange(event);
    setClosed();
  }, []);

  /**
   * When the button is clicked, open the file manager by clicking the hidden input element.
   */
  const handleButtonClick = useCallback(() => {
    inputRef?.current?.click();
    setIsOpened(true);
  }, []);

  /**
   * If the user cancels the file upload, close the file manager.
   */
  useEffect(() => {
    const node = stableInputRefGetter();

    if (node == null) return;
    node.addEventListener("cancel", setClosed);

    return () => {
      if (node == null) return;
      node.removeEventListener("cancel", setClosed);
    };
  }, []);

  return (
    <InvisibleForm onSubmit={handleFormSubmit}>
      <InvisibleLabel>
        <InvisibleControl
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={onImagesUpload != null}
          onChange={handleChange}
          tabIndex={-1}
        />
        <ToggleButton
          ref={mergedRefs}
          data-component="ImageUploaderButton"
          type="button"
          toggled={isOpened}
          onClick={handleButtonClick}
          titleOn="Upload"
          titleOff="Upload"
          icon={<IconUpload />}
          scale={size === "medium" ? 2 : size === "large" ? 4 : 1}
          {...rest}
        />
      </InvisibleLabel>
    </InvisibleForm>
  );
}
