import { useEditorContext } from "../../AppContext";
import { CodeSnippet } from "../../components/CodeSnippet/CodeSnippet";
import { CodeSnippetHeader } from "../../components/CodeSnippetHeader/CodeSnippetHeader";
import { Dialog } from "../../components/Dialog/Dialog";
import { FocalPointEditor } from "../../components/FocalPointEditor/FocalPointEditor";
import type { ObjectPositionString } from "../../types";
import { LayoutMessage } from "../Layout.styled";

const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";
const DEFAULT_CODE_SNIPPET_LANGUAGE = "html" as const;

/**
 * Content for the image route (/:imageId). Renders the editing view or error messages
 * (image not found, page not found). Loading is handled by the shared Layout.
 */
export function Editor() {
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
    codeSnippetCopied,
    setCodeSnippetCopied,
    currentObjectPosition,
    pageState,
    isEditingSingleImage,
    handleImageError,
    handleObjectPositionChange,
  } = useEditorContext();

  if (pageState === "editing" && image != null && aspectRatio != null) {
    return (
      <>
        <FocalPointEditor
          imageUrl={image.url}
          aspectRatio={aspectRatio}
          initialAspectRatio={image.naturalAspectRatio}
          objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
          showFocalPoint={showFocalPoint ?? false}
          showImageOverflow={showImageOverflow ?? false}
          onObjectPositionChange={handleObjectPositionChange}
          onImageError={handleImageError}
        />
        <Dialog
          transparent
          open={showCodeSnippet}
          onOpenChange={setShowCodeSnippet}
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
              codeSnippetCopied={codeSnippetCopied}
              setCodeSnippetCopied={setCodeSnippetCopied}
            />
          </Dialog.Content>
        </Dialog>
      </>
    );
  }

  if (pageState === "pageNotFound") {
    return <LayoutMessage>Page not found...</LayoutMessage>;
  }

  if (pageState === "imageNotFound") {
    return (
      <LayoutMessage>
        {isEditingSingleImage && imageCount === 0
          ? "Start by uploading an image..."
          : "Image not found..."}
      </LayoutMessage>
    );
  }

  return <LayoutMessage>Critical error...</LayoutMessage>;
}
