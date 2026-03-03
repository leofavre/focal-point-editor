import { Suspense, useCallback } from "react";
import toast from "react-hot-toast";
import { Outlet, useLocation } from "react-router-dom";
import { useEditorContext } from "../AppContext";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { Button } from "../components/Button/Button";
import { FullScreenDropZone } from "../components/ImageUploader/FullScreenDropZone";
import type { UploadErrorCode } from "../components/ImageUploader/getUploadErrorMessage";
import { getUploadErrorMessage } from "../components/ImageUploader/getUploadErrorMessage";
import { ImageUploaderButton } from "../components/ImageUploader/ImageUploaderButton";
import { SiteTitle } from "../components/SiteTitle/SiteTitle";
import type { Err } from "../helpers/errorHandling";
import { parseBooleanAttr } from "../helpers/parseBooleanAttr";
import { IconCode } from "../icons/IconCode";
import { IconMask } from "../icons/IconMask";
import { IconReference } from "../icons/IconReference";
import {
  EditorControlsNav,
  LayoutGrid,
  LayoutHeader,
  LayoutMessage,
  LoadingSpinner,
  PrivacyLink,
} from "./Layout.styled";

/**
 * @todo
 *
 * ### MELHORIZE™ UI.
 *
 * - Keyboard shortcuts page.
 * - Back button in text-only pages.
 * - Better styling for text-only pages.
 *
 * ### Advanced functionality
 *
 * - Use the native API for page transitions.
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
    isLoading,
  } = useEditorContext();

  const { pathname } = useLocation();
  const isEditingOrLanding = pathname === "/" || /^\/image\/[^/]+$/.test(pathname);
  const isEditingRoute = /^\/image\/[^/]+$/.test(pathname);

  const handleImageUploadError = useCallback((error: Err<UploadErrorCode>) => {
    toast.error(getUploadErrorMessage(error));
  }, []);

  const handleDragStart = useCallback(() => {
    setShowCodeSnippet(false);
  }, [setShowCodeSnippet]);

  const isUIStateButtonDisabled =
    (!isEditingOrLanding && !isLoading) || (isEditingRoute && image == null);

  return (
    <>
      <FullScreenDropZone
        onImageUpload={handleImageUpload}
        onImageUploadError={handleImageUploadError}
        onDragStart={handleDragStart}
      />
      <LayoutGrid id="main" data-has-bottom-bar={parseBooleanAttr(showBottomBar)}>
        <LayoutHeader>
          <SiteTitle />
          <PrivacyLink to="/privacy">Privacy</PrivacyLink>
        </LayoutHeader>
        <Suspense
          fallback={
            <LayoutMessage role="status" aria-label="Loading">
              <LoadingSpinner aria-hidden />
            </LayoutMessage>
          }
        >
          <Outlet />
        </Suspense>
        <EditorControlsNav data-component="EditorControlsNav" aria-label="Editor controls">
          <Button
            type="button"
            data-component="FocalPointButton"
            toggleable
            toggled={showFocalPoint ?? false}
            onToggle={(toggled) => setShowFocalPoint(!toggled)}
            disabled={isUIStateButtonDisabled}
            grow
          >
            <IconReference />
            <Button.ButtonText>Focal point</Button.ButtonText>
          </Button>
          <Button
            type="button"
            data-component="ImageOverflowButton"
            toggleable
            toggled={showImageOverflow ?? false}
            onToggle={(toggled) => setShowImageOverflow(!toggled)}
            disabled={isUIStateButtonDisabled}
            grow
          >
            <IconMask />
            <Button.ButtonText>Overflow</Button.ButtonText>
          </Button>
          <AspectRatioSlider
            ref={aspectRatioSliderRef}
            aspectRatio={aspectRatio}
            defaultAspectRatio={image?.naturalAspectRatio}
            onAspectRatioChange={setAspectRatio}
          />
          <Button
            type="button"
            data-component="CodeSnippetButton"
            toggleable
            toggled={showCodeSnippet ?? false}
            onToggle={(toggled) => setShowCodeSnippet(!toggled)}
            disabled={isUIStateButtonDisabled}
            grow
          >
            <IconCode />
            <Button.ButtonText>Code</Button.ButtonText>
          </Button>
          <ImageUploaderButton
            ref={uploaderButtonRef}
            label="Image"
            onImageUpload={handleImageUpload}
            onImageUploadError={handleImageUploadError}
            grow
          />
        </EditorControlsNav>
      </LayoutGrid>
    </>
  );
}
