import { CodeSnippet } from "@/components/CodeSnippet/CodeSnippet";
import { CodeSnippetHeader } from "@/components/CodeSnippetHeader/CodeSnippetHeader";
import { Dialog } from "@/components/Dialog/Dialog";
import { FocalPointEditor } from "@/components/FocalPointEditor/FocalPointEditor";
import { LayoutMessage } from "@/pages/(layout)/Layout.styled";
import { useEditorContext } from "@/src/AppContext";
import type { ObjectPositionString } from "@/src/types";

const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";
const DEFAULT_CODE_SNIPPET_LANGUAGE = "html" as const;

export function EditPage() {
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
    handleImageError,
    handleObjectPositionChange,
    focalPointImageRef,
    imageNotFoundConfirmed,
    isEditingSingleImage,
  } = useEditorContext();

  if (image != null && aspectRatio != null) {
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
    );
  }

  if (imageNotFoundConfirmed) {
    return (
      <LayoutMessage>
        {isEditingSingleImage && imageCount === 0
          ? "Start by uploading an image"
          : "Image not found"}
      </LayoutMessage>
    );
  }

  return null;
}
