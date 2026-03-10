import type { PropsWithChildren } from "react";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { FullScreenDropZone } from "@/components/ImageUploader/FullScreenDropZone";
import type { UploadErrorCode } from "@/components/ImageUploader/getUploadErrorMessage";
import { getUploadErrorMessage } from "@/components/ImageUploader/getUploadErrorMessage";
import { SiteTitle } from "@/components/SiteTitle/SiteTitle";
import { useEditorContext } from "@/src/AppContext";
import type { Err } from "@/src/helpers/errorHandling";
import { HeaderLinks, LayoutGrid, LayoutHeader, PrivacyLink } from "./Layout.styled";

/**
 * @todo
 *
 * ### MELHORIZE™ UI.
 *
 * - Review Privacy all pages.
 * - Better styling for text-only pages.
 * - Make sure button is animated from disabled to enable every time, but specially during hydration.
 * - Maybe refactor context so that some part is restricted to editing images and some part is shared in the whole app (like drag and drop)?
 * - Keep overlay for a few seconds when image is loaded using the big button on the Landing page.
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
  const { handleImageUpload, setShowCodeSnippet } = useEditorContext();

  const handleImageUploadError = useCallback((error: Err<UploadErrorCode>) => {
    toast.error(getUploadErrorMessage(error));
  }, []);

  const handleDragStart = useCallback(() => {
    setShowCodeSnippet(false);
  }, [setShowCodeSnippet]);

  return (
    <>
      <FullScreenDropZone
        onImageUpload={handleImageUpload}
        onImageUploadError={handleImageUploadError}
        onDragStart={handleDragStart}
      />
      <LayoutGrid id="main">
        <LayoutHeader>
          <SiteTitle />
          <HeaderLinks>
            <PrivacyLink href="/shortcuts">Shortcuts</PrivacyLink>
            <PrivacyLink href="/privacy">Privacy</PrivacyLink>
          </HeaderLinks>
        </LayoutHeader>
        {children}
      </LayoutGrid>
    </>
  );
}
