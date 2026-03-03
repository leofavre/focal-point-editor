import { useCallback } from "react";
import toast from "react-hot-toast";
import { useEditorContext } from "../../AppContext";
import { CodeSnippet } from "../../components/CodeSnippet/CodeSnippet";
import { CodeSnippetHeader } from "../../components/CodeSnippetHeader/CodeSnippetHeader";
import { Dialog } from "../../components/Dialog/Dialog";
import { FocalPointEditor } from "../../components/FocalPointEditor/FocalPointEditor";
import { HowToUse } from "../../components/HowToUse/HowToUse";
import type { UploadErrorCode } from "../../components/ImageUploader/getUploadErrorMessage";
import { getUploadErrorMessage } from "../../components/ImageUploader/getUploadErrorMessage";
import { ImageUploaderButton } from "../../components/ImageUploader/ImageUploaderButton";
import type { Err } from "../../helpers/errorHandling";
import type { ObjectPositionString } from "../../types";
import { LandingWrapper } from "../Landing/Landing.styled";
import { LayoutMessage } from "../Layout.styled";

const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";
const DEFAULT_CODE_SNIPPET_LANGUAGE = "html" as const;

/**
 * Content for the current route. Renders landing, editing view, or status messages
 * (image not found, page not found, error). Loading is handled by the shared Layout.
 */
export function PageContent() {
  const {
    image,
    imageCount,
    aspectRatio,
    showFocalPoint,
    showImageOverflow,
    showCodeSnippet,
    setShowCodeSnippet,
    codeSnippetLanguage,
    setCodeSnippetLanguage,
    currentObjectPosition,
    pageState,
    isEditingSingleImage,
    handleImageError,
    handleObjectPositionChange,
    handleImageUpload,
    isLoading,
    focalPointImageRef,
  } = useEditorContext();

  const handleImageUploadError = useCallback((error: Err<UploadErrorCode>) => {
    toast.error(getUploadErrorMessage(error));
  }, []);

  const getAriaReadyTransitionProps = useCallback((isVisible: boolean) => {
    return {
      "aria-hidden": !isVisible,
      inert: !isVisible,
      css: {
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? "visible" : "hidden",
        pointerEvents: isVisible ? "auto" : "none",
        transition: isVisible
          ? "opacity 132ms ease-in-out, visibility 0s linear 0s"
          : "opacity 132ms ease-in-out, visibility 0s linear 132ms",
      },
    } as const;
  }, []);

  if (pageState === "landing" || pageState === "editing") {
    return (
      <>
        <LandingWrapper
          data-component="Landing"
          {...getAriaReadyTransitionProps(pageState === "landing")}
        >
          <ImageUploaderButton
            size="medium"
            label="Choose image"
            onImageUpload={handleImageUpload}
            onImageUploadError={handleImageUploadError}
          />
          <HowToUse />
        </LandingWrapper>
        {image != null && aspectRatio != null ? (
          <>
            <FocalPointEditor
              {...getAriaReadyTransitionProps(pageState === "editing")}
              imageUrl={image.url}
              aspectRatio={aspectRatio}
              initialAspectRatio={image.naturalAspectRatio}
              objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
              showFocalPoint={showFocalPoint ?? false}
              showImageOverflow={showImageOverflow ?? false}
              onObjectPositionChange={handleObjectPositionChange}
              onImageError={handleImageError}
              focalPointImageRef={focalPointImageRef}
            />
            <Dialog
              open={showCodeSnippet}
              onOpenChange={setShowCodeSnippet}
              aria-label="Code snippet"
              css={{ backgroundColor: "var(--color-background)" }}
            >
              <Dialog.Header>
                <CodeSnippetHeader
                  codeSnippetLanguage={codeSnippetLanguage ?? DEFAULT_CODE_SNIPPET_LANGUAGE}
                  setCodeSnippetLanguage={setCodeSnippetLanguage}
                />
              </Dialog.Header>
              <Dialog.Content>
                <CodeSnippet
                  src={image.name}
                  objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
                  language={codeSnippetLanguage ?? DEFAULT_CODE_SNIPPET_LANGUAGE}
                  triggerAutoFocus={showCodeSnippet}
                />
              </Dialog.Content>
            </Dialog>
          </>
        ) : null}
      </>
    );
  }

  if (isLoading) return null;

  if (pageState === "imageNotFound") {
    return (
      <LayoutMessage>
        {isEditingSingleImage && imageCount === 0
          ? "Start by uploading an image"
          : "Image not found"}
      </LayoutMessage>
    );
  }

  if (pageState === "pageNotFound") {
    return <LayoutMessage>Page not found</LayoutMessage>;
  }

  return <LayoutMessage>Critical error</LayoutMessage>;
}
