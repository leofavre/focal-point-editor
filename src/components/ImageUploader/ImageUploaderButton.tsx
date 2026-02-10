import { useEffectEvent, useRef, useState } from "react";
import { useMergeRefs } from "react-merge-refs";
import { IconUpload } from "../../icons/IconUpload";
import { ToggleButton } from "../ToggleButton/ToggleButton";
import { useImageDropzone } from "./hooks/useImageDropzone";
import { InvisibleControl, InvisibleForm, InvisibleLabel } from "./ImageUploader.styled";
import type { ImageUploaderButtonProps } from "./types";

export function ImageUploaderButton({
  ref,
  size = "small",
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
  ...rest
}: ImageUploaderButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mergedRefs = useMergeRefs([ref, buttonRef]);

  const [isOpened, setIsOpened] = useState(false);

  const setClosed = useEffectEvent(() => setIsOpened(false));

  const { getRootProps, getInputProps, open } = useImageDropzone({
    onImageUpload,
    onImagesUpload,
    onImageUploadError,
    onImagesUploadError,
    noClick: true,
    noDrag: true,
    multiple: onImagesUpload != null,
    onFileDialogCancel: setClosed,
    onDropAccepted: setClosed,
  });

  const handleButtonClick = () => {
    open();
    setIsOpened(true);
  };

  return (
    <InvisibleForm
      data-component="ImageUploaderButton"
      {...getRootProps({ onSubmit: (e) => e.preventDefault() })}
      {...rest}
    >
      <InvisibleLabel>
        <InvisibleControl {...getInputProps()} tabIndex={-1} />
        <ToggleButton
          ref={mergedRefs}
          type="button"
          toggled={isOpened}
          onClick={handleButtonClick}
          titleOn="Upload"
          titleOff="Upload"
          icon={<IconUpload />}
          scale={size === "medium" ? 2 : size === "large" ? 4 : 1}
        />
      </InvisibleLabel>
    </InvisibleForm>
  );
}
