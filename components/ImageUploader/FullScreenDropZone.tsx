import type { Ref } from "react";
import { useEffect, useEffectEvent, useRef } from "react";
import { mergeRefs } from "react-merge-refs";
import { useHydrated } from "vike-react/useHydrated";
import { parseBooleanAttr } from "@/src/helpers/parseBooleanAttr";
import { useClosingTransition, useDelayedClose } from "@/src/hooks/useClosingTransition";
import { BackdropOverlay } from "../BackdropOverlay/BackdropOverlay.styled";
import { useImageDropzone } from "./hooks/useImageDropzone";
import type { FullScreenDropZoneProps } from "./types";

export function FullScreenDropZone({
  onImageUpload,
  onImagesUpload,
  onImageUploadError,
  onImagesUploadError,
  onDragStart,
  ...rest
}: FullScreenDropZoneProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const isHydrated = useHydrated();

  const { getRootProps, getInputProps, isDragGlobal } = useImageDropzone({
    onImageUpload,
    onImagesUpload,
    onImageUploadError,
    onImagesUploadError,
    noClick: true,
    noDrag: false,
    multiple: onImagesUpload != null,
  });

  const stableHidePopover = useEffectEvent(() => {
    popoverRef.current?.hidePopover();
  });

  const { isClosing, requestClose, cancelClose } = useClosingTransition({
    onClose: stableHidePopover,
  });

  const { scheduleClose, cancelScheduledClose } = useDelayedClose({
    onSchedule: requestClose,
  });

  const { ref: rootRef, ...rootProps } = getRootProps();
  const mergedRefs = mergeRefs([popoverRef, rootRef as Ref<HTMLDivElement | null>]);

  useEffect(() => {
    if (popoverRef.current == null) return;

    if (isDragGlobal) {
      cancelScheduledClose();
      cancelClose();
      onDragStart?.();
      popoverRef.current.showPopover();
    } else {
      scheduleClose();
    }
  }, [isDragGlobal, onDragStart, scheduleClose, cancelScheduledClose, cancelClose]);

  return (
    <BackdropOverlay
      ref={mergedRefs}
      popover="manual"
      data-closing={parseBooleanAttr(isClosing)}
      {...rootProps}
      data-component="FullScreenDropZone"
      aria-hidden={!isDragGlobal}
      {...rest}
    >
      <input {...getInputProps()} aria-hidden disabled={!isHydrated} />
      <p>Drop an image here</p>
    </BackdropOverlay>
  );
}
