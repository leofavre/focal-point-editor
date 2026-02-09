import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDebouncedEffect from "use-debounced-effect";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { useAspectRatioList } from "../components/AspectRatioSlider/hooks/useAspectRatioList";
import { CodeSnippet } from "../components/CodeSnippet/CodeSnippet";
import { Dialog } from "../components/Dialog/Dialog";
import { FocalPointEditor } from "../components/FocalPointEditor/FocalPointEditor";
import { HowToUse } from "../components/HowToUse/HowToUse";
import { FullScreenDropZone } from "../components/ImageUploader/FullScreenDropZone";
import { ImageUploaderButton } from "../components/ImageUploader/ImageUploaderButton";
import { ToggleButton } from "../components/ToggleButton/ToggleButton";
import { IconCode } from "../icons/IconCode";
import { IconMask } from "../icons/IconMask";
import { IconReference } from "../icons/IconReference";
import type { ImageDraftStateAndFile, ImageState, ObjectPositionString } from "../types";
import { EditorGrid } from "./Editor.styled";
import { createImageStateFromImageRecord } from "./helpers/createImageStateFromImageRecord";
import { createKeyboardShortcutHandler } from "./helpers/createKeyboardShortcutHandler";
import { usePersistedImages } from "./hooks/usePersistedImages";
import { usePersistedUIRecord } from "./hooks/usePersistedUIRecord";

const DEFAULT_SHOW_FOCAL_POINT = false;
const DEFAULT_SHOW_IMAGE_OVERFLOW = false;
const DEFAULT_SHOW_CODE_SNIPPET = false;
const DEFAULT_CODE_SNIPPET_LANGUAGE = "html" as const;
const DEFAULT_ASPECT_RATIO = 1;
const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";

const INTERACTION_DEBOUNCE_MS = 500;
const IMAGE_LOAD_DEBOUNCE_MS = 50;

/**
 * @todo
 *
 * ### MELHORIZE™ UI.
 *
 * - Verify accessibility.
 * - Review aria labels.
 * - Remove titles from SVGs.
 * - Think about animations and transitions.
 * - Improve Full Screen Drop Zone.
 * - Improve Landing page.
 * - Improve Focal Point draggable icon.
 * - Is there a way to make it invert the colors of the underlying image?
 * - Improve Code snippet.
 * - Slider: use polygon instead of SVG.
 *
 * ### Basic functionality
 *
 * - Fix loading state saying "not found...".
 * - Fix image not resetting to original aspect ratio after upload.
 * - Fix app not working in Incognito mode on mobile Chrome.
 * - Make sure app works without any database (single image direct to React state on upload?).
 * - Handle errors in a consistent way. Review try/catch blocks. Test neverthrow.
 * - Remove all deprecated and dead code.
 *
 * ### DevOps
 *
 * - Control cache invalidation, given it's a PWA.
 * - Add integration tests (which tool to use?).
 * - Add Storybook tests (to see how it works?).
 *
 * ### Advanced functionality
 *
 * - Support external image sources.
 * - Breakpoints with container queries.
 * - Maybe make a browser extension?
 * - Maybe make a React component?
 * - Maybe make a native custom element?
 */
export default function Editor() {
  const uploaderButtonRef = useRef<HTMLButtonElement>(null);
  const isFirstImageLoadInSessionRef = useRef(true);

  const { imageId } = useParams<{ imageId: string }>();
  const [image, setImage] = useState<ImageState | null>(null);
  const { images, addImage, updateImage } = usePersistedImages();

  const [isLoading, setIsLoading] = useState(imageId != null);

  /**
   * Safely sets the image state revoking the previous blob URL if the new one is different.
   */
  const safeSetImage = useEffectEvent((valueOrFn) => {
    setImage((prevValue) => {
      const nextValue = typeof valueOrFn === "function" ? valueOrFn(prevValue) : valueOrFn;

      if (prevValue != null && prevValue.url !== nextValue?.url) {
        URL.revokeObjectURL(prevValue.url);
      }

      return nextValue;
    });
  }) satisfies typeof setImage;

  const [aspectRatio, setAspectRatio] = usePersistedUIRecord(
    { id: "aspectRatio", value: DEFAULT_ASPECT_RATIO },
    { service: "sessionStorage", debounceTimeout: INTERACTION_DEBOUNCE_MS },
  );

  const [showFocalPoint, setShowFocalPoint] = usePersistedUIRecord(
    { id: "showFocalPoint", value: DEFAULT_SHOW_FOCAL_POINT },
    { service: "sessionStorage" },
  );

  const [showImageOverflow, setShowImageOverflow] = usePersistedUIRecord(
    { id: "showImageOverflow", value: DEFAULT_SHOW_IMAGE_OVERFLOW },
    { service: "sessionStorage" },
  );

  const [showCodeSnippet, setShowCodeSnippet] = usePersistedUIRecord(
    { id: "showCodeSnippet", value: DEFAULT_SHOW_CODE_SNIPPET },
    { service: "sessionStorage" },
  );

  const [codeSnippetLanguage, setCodeSnippetLanguage] = usePersistedUIRecord(
    { id: "codeSnippetLanguage", value: DEFAULT_CODE_SNIPPET_LANGUAGE },
    { service: "sessionStorage" },
  );

  const [codeSnippetCopied, setCodeSnippetCopied] = useState(false);

  const aspectRatioList = useAspectRatioList(image?.naturalAspectRatio);

  const navigate = useNavigate();

  const handleImageUpload = useCallback(
    async (draftAndFile: ImageDraftStateAndFile | undefined) => {
      if (draftAndFile == null) return;

      const { imageDraft, file } = draftAndFile;

      let nextImageId: string | undefined;

      try {
        nextImageId = await addImage({ imageDraft, file });
        console.log("uploaded image with id", nextImageId);
      } catch (error) {
        console.error("Error saving image to database:", error);
      }

      if (nextImageId == null) return;

      await navigate(`/${nextImageId}`);
      console.log("navigated to", `/${nextImageId}`);
    },
    [addImage, navigate],
  );

  const handleImageError = useCallback(() => {
    console.error("Error uploading image");
    safeSetImage(null);
    setIsLoading(false);
  }, []);

  const handleObjectPositionChange = useCallback((objectPosition: ObjectPositionString) => {
    safeSetImage((prev) => (prev != null ? { ...prev, breakpoints: [{ objectPosition }] } : null));
  }, []);

  /**
   * When the application is unmounted, revoke the blob URL of the image to avoid memory leaks.
   */
  useEffect(() => {
    return () => {
      safeSetImage(null);
    };
  }, []);

  /**
   * Handles all keyboard shortcuts:
   * - 'u' opens the file input to upload a new image.
   * - 'a' or 'p' toggles the focal point.
   * - 's' or 'l' toggles the image overflow.
   * - 'd' or 'c' toggles the code snippet.
   *
   * The shortcuts are case insensitive and are not triggered
   * when modified with meta keys like Control or Command.
   */
  useEffect(() => {
    const handleKeyDown = createKeyboardShortcutHandler({
      u: () => {
        uploaderButtonRef.current?.click();
      },
      a: () => {
        setShowFocalPoint((prev) => !prev);
      },
      f: () => {
        setShowFocalPoint((prev) => !prev);
      },
      s: () => {
        setShowImageOverflow((prev) => !prev);
      },
      o: () => {
        setShowImageOverflow((prev) => !prev);
      },
      d: () => {
        setShowCodeSnippet((prev) => !prev);
      },
      c: () => {
        setShowCodeSnippet((prev) => !prev);
      },
    });

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowCodeSnippet, setShowFocalPoint, setShowImageOverflow]);

  const currentObjectPosition = image?.breakpoints?.[0]?.objectPosition;

  /**
   * Resets the code snippet copied state when the object position changes.
   */
  useEffect(() => {
    void currentObjectPosition;
    setCodeSnippetCopied(false);
  }, [currentObjectPosition]);

  /**
   * Resets the code snippet copied state when the code snippet language changes.
   */
  useEffect(() => {
    void codeSnippetLanguage;
    setCodeSnippetCopied(false);
  }, [codeSnippetLanguage]);

  /**
   * Injects `overflow: hidden` to the body element when the editor is rendered.
   */
  useEffect(() => {
    document.body.style.overflow = image && imageId ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [image, imageId]);

  /**
   * Updates the object position of the image in the database when the user interacts with it
   * either by dragging the focal point or the image itself.
   */
  useDebouncedEffect(
    () => {
      if (imageId == null || currentObjectPosition == null) return;

      updateImage(imageId, {
        breakpoints: [{ objectPosition: currentObjectPosition }],
      })
        .then((id) => {
          if (id == null) return;
          console.log("updated image", imageId, "with object position", currentObjectPosition);
        })
        .catch((error) => {
          console.error("Error saving position to database:", error);
        });
    },
    { timeout: INTERACTION_DEBOUNCE_MS },
    [imageId, currentObjectPosition, updateImage],
  );

  const imageCount = images?.length ?? 0;

  const stableImageRecordGetter = useEffectEvent((imageId: string) => {
    return images?.find((image) => image.id === imageId);
  });

  /**
   * Loads the image record from the database when the page is loaded or the database is
   * refreshed. A debounce is used because both events can happen almost at the same time.
   *
   * After the image record is loaded, the image state is created with a new blob URL and
   * the calculated natural aspect ratio.
   */
  useDebouncedEffect(
    () => {
      async function asyncSetImageState() {
        if (imageCount === 0 || imageId == null) {
          safeSetImage(null);
          setIsLoading(false);
          return;
        }

        const imageRecord = stableImageRecordGetter(imageId);

        if (imageRecord == null) {
          safeSetImage(null);
          setIsLoading(false);
          return;
        }

        try {
          const nextImageState = await createImageStateFromImageRecord(imageRecord);
          safeSetImage(nextImageState);
          setIsLoading(false);
          console.log("loaded image from record", imageRecord);

          if (isFirstImageLoadInSessionRef.current) {
            isFirstImageLoadInSessionRef.current = false;
            return;
          }

          setAspectRatio(nextImageState.naturalAspectRatio ?? DEFAULT_ASPECT_RATIO);
        } catch (error) {
          safeSetImage(null);
          setIsLoading(false);
          console.error("Error loading saved image:", error);
        }
      }

      asyncSetImageState();
    },
    { timeout: IMAGE_LOAD_DEBOUNCE_MS },
    [imageId, imageCount],
  );

  if (!imageId) {
    return (
      <>
        <FullScreenDropZone onImageUpload={handleImageUpload} />
        <EditorGrid>
          <div
            css={{
              gridColumn: "1 / -1",
              gridRow: "1 / -1",

              display: "grid",
              gridTemplateColumns: "auto",
              gridTemplateRows: "auto auto",
              margin: "auto",
              padding: "var(--base-line)",
              paddingTop: "var(--base-line-2x)",
              paddingLeft: "var(--base-line-2x)",
              gap: "var(--base-line-2x)",
              boxSizing: "border-box",
              backgroundColor: "var(--color-zero)",
            }}
          >
            <ImageUploaderButton
              ref={uploaderButtonRef}
              size="medium"
              onImageUpload={handleImageUpload}
              css={{
                width: "calc(100% - var(--base-line))",
                maxWidth: "16rem",
                gridRow: "auto !important",
                gridColumn: "auto !important",
              }}
            />
            <HowToUse
              css={{
                padding: "var(--base-line)",
              }}
            />
          </div>
        </EditorGrid>
      </>
    );
  }

  return (
    <>
      <FullScreenDropZone onImageUpload={handleImageUpload} />
      <EditorGrid>
        {showFocalPoint != null && (
          <ToggleButton
            type="button"
            data-component="FocalPointButton"
            toggled={showFocalPoint}
            onToggle={(toggled) => setShowFocalPoint(!toggled)}
            titleOn="Focal point"
            titleOff="Focal point"
            icon={<IconReference />}
          />
        )}
        {showImageOverflow != null && (
          <ToggleButton
            type="button"
            data-component="ImageOverflowButton"
            toggled={showImageOverflow}
            onToggle={(toggled) => setShowImageOverflow(!toggled)}
            titleOn="Overflow"
            titleOff="Overflow"
            icon={<IconMask />}
          />
        )}
        {isLoading ? (
          <h3 style={{ gridColumn: "1 / -1", gridRow: "1 / -2", margin: "auto" }}>Loading...</h3>
        ) : !image ? (
          <h3 style={{ gridColumn: "1 / -1", gridRow: "1 / -2", margin: "auto" }}>Not found...</h3>
        ) : (
          <>
            {aspectRatio != null && image.naturalAspectRatio != null && (
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
            )}
            <Dialog transparent open={showCodeSnippet} onOpenChange={setShowCodeSnippet}>
              <CodeSnippet
                src={image.name}
                objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
                language={codeSnippetLanguage ?? DEFAULT_CODE_SNIPPET_LANGUAGE}
                onLanguageChange={setCodeSnippetLanguage}
                copied={codeSnippetCopied}
                onCopiedChange={setCodeSnippetCopied}
              />
            </Dialog>
          </>
        )}
        <AspectRatioSlider
          aspectRatio={aspectRatio}
          aspectRatioList={aspectRatioList}
          onAspectRatioChange={setAspectRatio}
        />
        {showCodeSnippet != null && (
          <ToggleButton
            type="button"
            data-component="CodeSnippetButton"
            toggled={showCodeSnippet}
            onToggle={(toggled) => setShowCodeSnippet(!toggled)}
            titleOn="Code"
            titleOff="Code"
            icon={<IconCode />}
          />
        )}
        <ImageUploaderButton ref={uploaderButtonRef} onImageUpload={handleImageUpload} />
      </EditorGrid>
    </>
  );
}
