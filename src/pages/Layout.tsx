import { Suspense, useCallback } from "react";
import toast from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { useEditorContext } from "../AppContext";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { FullScreenDropZone } from "../components/ImageUploader/FullScreenDropZone";
import type { UploadErrorCode } from "../components/ImageUploader/getUploadErrorMessage";
import { getUploadErrorMessage } from "../components/ImageUploader/getUploadErrorMessage";
import { ImageUploaderButton } from "../components/ImageUploader/ImageUploaderButton";
import { SiteTitle } from "../components/SiteTitle/SiteTitle";
import { ToggleButton } from "../components/ToggleButton/ToggleButton";
import type { Err } from "../helpers/errorHandling";
import { parseBooleanAttr } from "../helpers/parseBooleanAttr";
import { IconCode } from "../icons/IconCode";
import { IconMask } from "../icons/IconMask";
import { IconReference } from "../icons/IconReference";
import { EditorControlsNav, LayoutGrid, LayoutMessage, LoadingSpinner } from "./Layout.styled";

/**
 * @todo
 *
 * ### MELHORIZE™ UI.
 *
 * - Keyboard shortcuts page.
 * - LGPD page + compliance.
 *
 * ### Advanced functionality
 *
 * - Support external image sources.
 * - Multiple images with "file system".
 * - Maybe make a browser extension?
 * - Maybe make a React component?
 * - Maybe make a native custom element?
 * - Maybe SSR?
 */
export default function Layout() {
  const {
    image,
    aspectRatio,
    setAspectRatio,
    showFocalPoint,
    setShowFocalPoint,
    showImageOverflow,
    setShowImageOverflow,
    showCodeSnippet,
    setShowCodeSnippet,
    showBottomBar,
    handleImageUpload,
    uploaderButtonRef,
    aspectRatioSliderRef,
    pageState,
    isLoading,
    isPageNotFoundRoute,
  } = useEditorContext();

  const handleImageUploadError = useCallback((error: Err<UploadErrorCode>) => {
    toast.error(getUploadErrorMessage(error));
  }, []);

  const handleDragStart = useCallback(() => {
    setShowCodeSnippet(false);
  }, [setShowCodeSnippet]);

  const isUIStateButtonDisabled =
    isPageNotFoundRoute || (pageState !== "landing" && pageState !== "editing" && !isLoading);

  return (
    <>
      <FullScreenDropZone
        onImageUpload={handleImageUpload}
        onImageUploadError={handleImageUploadError}
        onDragStart={handleDragStart}
      />
      <LayoutGrid id="main" data-has-bottom-bar={parseBooleanAttr(showBottomBar)}>
        <SiteTitle />
        <Suspense
          fallback={
            <LayoutMessage key="loading" role="status" aria-label="Loading">
              <LoadingSpinner aria-hidden />
            </LayoutMessage>
          }
        >
          <Outlet />
        </Suspense>
        <EditorControlsNav data-component="EditorControlsNav" aria-label="Editor controls">
          <ToggleButton
            type="button"
            data-component="FocalPointButton"
            toggleable
            toggled={showFocalPoint ?? false}
            onToggle={(toggled) => setShowFocalPoint(!toggled)}
            disabled={isUIStateButtonDisabled}
          >
            <IconReference />
            <ToggleButton.ButtonText>Focal point</ToggleButton.ButtonText>
          </ToggleButton>
          <ToggleButton
            type="button"
            data-component="ImageOverflowButton"
            toggleable
            toggled={showImageOverflow ?? false}
            onToggle={(toggled) => setShowImageOverflow(!toggled)}
            disabled={isUIStateButtonDisabled}
          >
            <IconMask />
            <ToggleButton.ButtonText>Overflow</ToggleButton.ButtonText>
          </ToggleButton>
          <AspectRatioSlider
            ref={aspectRatioSliderRef}
            aspectRatio={aspectRatio}
            defaultAspectRatio={image?.naturalAspectRatio}
            onAspectRatioChange={setAspectRatio}
          />
          <ToggleButton
            type="button"
            data-component="CodeSnippetButton"
            toggleable
            toggled={showCodeSnippet ?? false}
            onToggle={(toggled) => setShowCodeSnippet(!toggled)}
            disabled={isUIStateButtonDisabled}
          >
            <IconCode />
            <ToggleButton.ButtonText>Code</ToggleButton.ButtonText>
          </ToggleButton>
          <ImageUploaderButton
            ref={uploaderButtonRef}
            label="Image"
            onImageUpload={handleImageUpload}
            onImageUploadError={handleImageUploadError}
          />
        </EditorControlsNav>
      </LayoutGrid>
    </>
  );
}
