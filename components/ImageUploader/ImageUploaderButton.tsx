import type { Ref } from "react";
import { useEffectEvent, useRef, useState } from "react";
import { mergeRefs, useMergeRefs } from "react-merge-refs";
import { parseBooleanAttr } from "@/src/helpers/parseBooleanAttr";
import { useClosingTransition, useDelayedClose } from "@/src/hooks/useClosingTransition";
import { IconAdd } from "@/src/icons/IconAdd";
import type { ImageDraftStateAndFile, ImageDraftStateAndUrl } from "@/src/types";
import { BackdropOverlay } from "../BackdropOverlay/BackdropOverlay.styled";
import { Button } from "../Button/Button";
import { useImageDropzone } from "./hooks/useImageDropzone";
import { InvisibleControl, InvisibleForm, InvisibleLabel } from "./ImageUploader.styled";
import type { ImageUploaderButtonProps } from "./types";

export function ImageUploaderButton({
  ref,
  label,
  size = "small",
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
  grow,
  ...rest
}: ImageUploaderButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const mergedRefs = useMergeRefs([ref, buttonRef]);

  const [isOpened, setIsOpened] = useState(false);

  const stableHidePopover = useEffectEvent(() => {
    popoverRef.current?.hidePopover();
  });

  const { isClosing, requestClose } = useClosingTransition({
    onClose: stableHidePopover,
  });

  const { scheduleClose } = useDelayedClose({
    onSchedule: requestClose,
  });

  const scheduleBackdropHide = useEffectEvent(() => {
    setIsOpened(false);
    scheduleClose();
  });

  const wrappedOnImageUpload = useEffectEvent(
    (draftAndFileOrUrl: ImageDraftStateAndFile | ImageDraftStateAndUrl) => {
      void Promise.resolve(onImageUpload?.(draftAndFileOrUrl)).finally(scheduleBackdropHide);
    },
  );

  const wrappedOnImagesUpload = useEffectEvent(
    (draftsAndFilesOrUrls: (ImageDraftStateAndFile | ImageDraftStateAndUrl)[]) => {
      void Promise.resolve(onImagesUpload?.(draftsAndFilesOrUrls)).finally(scheduleBackdropHide);
    },
  );

  const wrappedOnImageUploadError = useEffectEvent(
    (error: Parameters<NonNullable<typeof onImageUploadError>>[0]) => {
      onImageUploadError?.(error);
      scheduleBackdropHide();
    },
  );

  const wrappedOnImagesUploadError = useEffectEvent(
    (errors: Parameters<NonNullable<typeof onImagesUploadError>>[0]) => {
      onImagesUploadError?.(errors);
      scheduleBackdropHide();
    },
  );

  const { getRootProps, getInputProps, open } = useImageDropzone({
    onImageUpload: onImageUpload != null ? wrappedOnImageUpload : undefined,
    onImagesUpload: onImagesUpload != null ? wrappedOnImagesUpload : undefined,
    onImageUploadError: onImageUploadError != null ? wrappedOnImageUploadError : undefined,
    onImagesUploadError: onImagesUploadError != null ? wrappedOnImagesUploadError : undefined,
    noClick: true,
    noDrag: true,
    multiple: onImagesUpload != null,
    onFileDialogCancel: scheduleBackdropHide,
    onDropAccepted: () => setIsOpened(false),
  });

  const handleButtonClick = () => {
    popoverRef.current?.showPopover();
    setIsOpened(true);
    open();
  };

  const { ref: dropzoneRef, ...dropzoneRootProps } = getRootProps();
  const overlayMergedRefs = mergeRefs([popoverRef, dropzoneRef as Ref<HTMLDivElement | null>]);

  return (
    <>
      <BackdropOverlay
        ref={overlayMergedRefs}
        popover="manual"
        data-closing={parseBooleanAttr(isClosing)}
        {...dropzoneRootProps}
        data-component="ImageUploaderButtonOverlay"
        aria-hidden
      >
        <InvisibleControl {...getInputProps()} tabIndex={-1} aria-hidden />
      </BackdropOverlay>
      <InvisibleForm data-component="ImageUploaderButton" {...rest}>
        <InvisibleLabel>
          <Button
            ref={mergedRefs}
            type="button"
            aria-label={label}
            toggleable
            toggled={isOpened}
            onClick={handleButtonClick}
            scale={size === "medium" ? 2 : size === "large" ? 4 : 1}
            grow={grow}
          >
            <IconAdd />
            <Button.ButtonText>{label}</Button.ButtonText>
          </Button>
        </InvisibleLabel>
      </InvisibleForm>
    </>
  );
}
