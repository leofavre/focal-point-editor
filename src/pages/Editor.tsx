import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDebouncedEffect from "use-debounced-effect";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { useAspectRatioList } from "../components/AspectRatioSlider/hooks/useAspectRatioList";
import { CodeSnippet } from "../components/CodeSnippet/CodeSnippet";
import { Dialog } from "../components/Dialog/Dialog";
import { FocalPointEditor } from "../components/FocalPointEditor/FocalPointEditor";
import { HowToUse } from "../components/HowToUse/HowToUse";
import { ImageUploader } from "../components/ImageUploader/ImageUploader";
import { ToggleButton } from "../components/ToggleButton/ToggleButton";
import { IconCode } from "../icons/IconCode";
import { IconMask } from "../icons/IconMask";
import { IconReference } from "../icons/IconReference";
import { IconUpload } from "../icons/IconUpload";
import type { ImageDraftStateAndFile, ImageState, ObjectPositionString } from "../types";
import { EditorGrid } from "./Editor.styled";
import { createImageStateFromImageRecord } from "./helpers/createImageStateFromImageRecord";
import { createKeyboardShortcutHandler } from "./helpers/createKeyboardShortcutHandler";
import { usePersistedImages } from "./hooks/usePersistedImages";
import { usePersistedUIRecord } from "./hooks/usePersistedUIRecord";

const DEFAULT_SHOW_POINT_MARKER = false;
const DEFAULT_SHOW_GHOST_IMAGE = false;
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
 * - Better typography.
 * - Make shure focus is visible, specially in AspectRatioSlider.
 * - Verify accessibility.
 * - Review aria labels.
 * - Think about animations and transitions.
 * - Favicon.
 * - Use native dialog.
 *
 * ### Basic functionality
 *
 * - Reset to original aspect ratio when uploaded.
 * - Handle errors in a consistent way. Review try/catch blocks. Test neverthrow.
 * - Fix app not working in Incognito mode on mobile Chrome.
 * - Make sure app works without any database (single image direct to React state on upload?).
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
 * - Can I make the loading immediate on refresh?
 * - Maybe make a browser extension?
 * - Maybe make a React component?
 * - Maybe make a native custom element?
 */
export default function Editor() {
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const [showPointMarker, setShowPointMarker] = usePersistedUIRecord(
    { id: "showPointMarker", value: DEFAULT_SHOW_POINT_MARKER },
    { service: "sessionStorage" },
  );

  const [showGhostImage, setShowGhostImage] = usePersistedUIRecord(
    { id: "showGhostImage", value: DEFAULT_SHOW_GHOST_IMAGE },
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
  const [showImageUploader, setShowImageUploader] = useState(false);

  const aspectRatioList = useAspectRatioList(image?.naturalAspectRatio);

  const navigate = useNavigate();

  const handleImageUpload = useCallback(
    async (draftAndFile: ImageDraftStateAndFile | undefined) => {
      setShowImageUploader(false);

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
   * - 'a' or 'p' toggles the point marker.
   * - 's' or 'l' toggles the ghost image.
   * - 'd' or 'c' toggles the code snippet.
   *
   * The shortcuts are case insensitive and are not triggered
   * when modified with meta keys like Control or Command.
   */
  useEffect(() => {
    const handleKeyDown = createKeyboardShortcutHandler({
      u: () => {
        fileInputRef.current?.click();
      },
      a: () => {
        setShowPointMarker((prev) => !prev);
      },
      p: () => {
        setShowPointMarker((prev) => !prev);
      },
      s: () => {
        setShowGhostImage((prev) => !prev);
      },
      l: () => {
        setShowGhostImage((prev) => !prev);
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
  }, [setShowCodeSnippet, setShowPointMarker, setShowGhostImage]);

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
      <EditorGrid>
        <ImageUploader onImageUpload={handleImageUpload}>
          <HowToUse />
        </ImageUploader>
      </EditorGrid>
    );
  }

  return (
    <EditorGrid>
      {showPointMarker != null && (
        <ToggleButton
          data-component="PointerMarkerButton"
          toggled={showPointMarker}
          onToggle={() => setShowPointMarker((prev) => !prev)}
          titleOn="Hide pointer marker"
          titleOff="Show pointer marker"
          icon={<IconReference />}
        />
      )}
      {showGhostImage != null && (
        <ToggleButton
          data-component="GhostImageButton"
          toggled={showGhostImage}
          onToggle={() => setShowGhostImage((prev) => !prev)}
          titleOn="Hide ghost image"
          titleOff="Show ghost image"
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
              showPointMarker={showPointMarker ?? false}
              showGhostImage={showGhostImage ?? false}
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
          data-component="CodeSnippetButton"
          toggled={showCodeSnippet}
          onToggle={() => setShowCodeSnippet((prev) => !prev)}
          titleOn="Hide code snippet"
          titleOff="Show code snippet"
          icon={<IconCode />}
        />
      )}
      <ToggleButton
        data-component="ImageUploaderButton"
        toggled={showImageUploader}
        onToggle={() => setShowImageUploader((prev) => !prev)}
        titleOn="Hide image uploader"
        titleOff="Show image uploader"
        icon={<IconUpload />}
      />
      <Dialog open={showImageUploader} onOpenChange={setShowImageUploader}>
        <ImageUploader ref={fileInputRef} onImageUpload={handleImageUpload}>
          <HowToUse />
        </ImageUploader>
      </Dialog>
    </EditorGrid>
  );
}
