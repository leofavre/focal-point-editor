import type { PropsWithChildren } from "react";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { AspectRatioSlider } from "@/components/AspectRatioSlider/AspectRatioSlider";
import { Button } from "@/components/Button/Button";
import { FullScreenDropZone } from "@/components/ImageUploader/FullScreenDropZone";
import type { UploadErrorCode } from "@/components/ImageUploader/getUploadErrorMessage";
import { getUploadErrorMessage } from "@/components/ImageUploader/getUploadErrorMessage";
import { ImageUploaderButton } from "@/components/ImageUploader/ImageUploaderButton";
import { SiteTitle } from "@/components/SiteTitle/SiteTitle";
import { useEditorContext } from "@/src/AppContext";
import type { Err } from "@/src/helpers/errorHandling";
import { parseBooleanAttr } from "@/src/helpers/parseBooleanAttr";
import { IconCode } from "@/src/icons/IconCode";
import { IconMask } from "@/src/icons/IconMask";
import { IconReference } from "@/src/icons/IconReference";
import {
  EditorControlsNav,
  HeaderLinks,
  LayoutGrid,
  LayoutHeader,
  PrivacyLink,
} from "./Layout.styled";

/**
 * @todo
 *
 * ### MELHORIZE™ UI.
 *
 * - Review Privacy all pages.
 * - Better styling for text-only pages.
 * - Make sure button is animated from disabled to enable every time, but specially during hydration.
 * - Remove animation of bottom bar and make it part of editing.
 * - Maybe refactor context so that some part is restricted to editing images and some part is shared in the whole app (like drag and drop)?
 *
 * ### Multi-site set-up.
 *
 * - Text for devs.
 * - Text for designers.
 * - Cross-linking between sites.
 * - GDPR compliant analytics.
 * - Buy domains.
 * - Set up DNS.
 *
 * ### Advanced functionality
 *
 * - Support videos.
 * - Use the native API for page transitions.
 * - Support external image sources.
 * - Multiple images with "file system".
 * - Maybe make a browser extension?
 * - Maybe make a native custom element?
 */
export default function Layout({ children }: PropsWithChildren) {
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

  const { pathname } = useEditorContext();
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
          <HeaderLinks>
            <PrivacyLink href="/shortcuts">Shortcuts</PrivacyLink>
            <PrivacyLink href="/privacy">Privacy</PrivacyLink>
          </HeaderLinks>
        </LayoutHeader>
        {children}
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
