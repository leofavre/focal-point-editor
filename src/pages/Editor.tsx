import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useDebouncedEffect from "use-debounced-effect";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { useAspectRatioList } from "../components/AspectRatioSlider/hooks/useAspectRatioList";
import { CodeSnippet } from "../components/CodeSnippet/CodeSnippet";
import { Dialog } from "../components/Dialog/Dialog";
import { FocalPointEditor } from "../components/FocalPointEditor/FocalPointEditor";
import { FullScreenDropZone } from "../components/ImageUploader/FullScreenDropZone";
import { ImageUploaderButton } from "../components/ImageUploader/ImageUploaderButton";
import { ToggleButton } from "../components/ToggleButton/ToggleButton";
import { IconCode } from "../icons/IconCode";
import { IconMask } from "../icons/IconMask";
import { IconReference } from "../icons/IconReference";
import type {
  ImageDraftStateAndFile,
  ImageId,
  ImageState,
  ObjectPositionString,
  UIPersistenceMode,
} from "../types";
import { EditorGrid } from "./Editor.styled";
import { createImageStateFromDraftAndFile } from "./helpers/createImageStateFromDraftAndFile";
import { createImageStateFromRecord } from "./helpers/createImageStateFromRecord";
import { createKeyboardShortcutHandler } from "./helpers/createKeyboardShortcutHandler";
import { usePageState } from "./hooks/usePageState";
import { usePersistedImages } from "./hooks/usePersistedImages";
import { usePersistedUIRecord } from "./hooks/usePersistedUIRecord";
import { Landing } from "./Landing/Landing";

const DEFAULT_SHOW_FOCAL_POINT = false;
const DEFAULT_SHOW_IMAGE_OVERFLOW = false;
const DEFAULT_SHOW_CODE_SNIPPET = false;
const DEFAULT_CODE_SNIPPET_LANGUAGE = "html" as const;
const DEFAULT_ASPECT_RATIO = 1;
const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";

const INTERACTION_DEBOUNCE_MS = 500;
const IMAGE_LOAD_DEBOUNCE_MS = 50;

/**
 * @todo Maybe add persistence as a feature? Maybe add to an environment variable?
 */
const PERSISTENCE_MODE: UIPersistenceMode = "persistent"; // typeof window.indexedDB !== "undefined" ? "persistent" : "ephemeral";

const noop = () => {};

/**
 * @todo
 *
 * ### MELHORIZE™ UI.
 *
 * - Verify accessibility.
 * - Review aria labels.
 * - Think about animations and transitions.
 * - Improve Landing page.
 * - Improve Full Screen Drop Zone.
 * - Improve Focal Point draggable icon. Is there a way to make it invert the colors of the underlying image?
 * - Improve loading state.
 * - Improve Code snippet.
 * - Improve toasters.
 * - Slider: use polygon instead of SVG. Can I use it in the background-image?
 *
 * ### Basic functionality
 *
 * - Handle errors with toaster.
 * - Fix app not working in Incognito mode on mobile Chrome. Maybe fixed by not relying on IndexedDB?
 * - Fix aspect ratio being reset on refresh. But on refresh only.
 * - Fix weird shadow in buttons.
 * - Remove all deprecated and dead code.
 *
 * ### DevOps
 *
 * - Fix broken pre-release pipeline. Maybe add PAT?
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
  const persistenceMode = PERSISTENCE_MODE;
  const uploaderButtonRef = useRef<HTMLButtonElement>(null);

  /**
   * @todo Handle onRefreshImagesError.
   */
  const { images, addImage, updateImage } = usePersistedImages({
    enabled: persistenceMode === "persistent",
    onRefreshImagesError: noop,
  });

  const { imageId } = useParams<{ imageId: ImageId }>();
  const [image, setImage] = useState<ImageState | null>(null);

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

      const imageStateResult = await createImageStateFromDraftAndFile(draftAndFile);

      /**
       * @todo Maybe show error to the user in the UI.
       */
      if (imageStateResult.rejected != null) {
        toast.error(`Error creating image state: ${String(imageStateResult.rejected.reason)}`);
        return;
      }

      /**
       * The image is set before it's added to the database. This guarantees that the app
       * works even without persistent storage. The worst case scenario is the user hitting
       * refresh and losing the image and the current object position.
       */
      safeSetImage(imageStateResult.accepted);
      setAspectRatio(imageStateResult.accepted.naturalAspectRatio ?? DEFAULT_ASPECT_RATIO);

      if (persistenceMode === "ephemeral") return;

      const addResult = await addImage({ imageDraft, file });

      if (addResult.accepted != null) {
        console.log("saved image with id", addResult.accepted);
        await navigate(`/${addResult.accepted}`);
        console.log("navigated to", `/${addResult.accepted}`);
      }
    },
    [persistenceMode, addImage, navigate, setAspectRatio],
  );

  const handleImageError = useCallback(() => {
    toast.error("Error uploading image");
    safeSetImage(null);
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
   *
   * @todo Review this logic.
   */
  useEffect(() => {
    document.body.style.overflow = image && imageId ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [image, imageId]);

  /**
   * Updates the object position of the image in the database when the user interacts with it
   * either by dragging the focal point or the image itself. If the app is in ephemeral mode,
   * the object position is still updated in the UI via local state.
   */
  useDebouncedEffect(
    () => {
      if (imageId == null || currentObjectPosition == null) return;

      updateImage(imageId, {
        breakpoints: [{ objectPosition: currentObjectPosition }],
      }).then((result) => {
        /**
         * @todo Maybe show error to the user in the UI.
         */
        if (result.rejected != null) {
          toast.error(`Error saving position to database: ${String(result.rejected.reason)}`);
          return;
        }
        if (result.accepted != null) {
          console.log("updated image", imageId, "with object position", currentObjectPosition);
        }
      });
    },
    { timeout: INTERACTION_DEBOUNCE_MS },
    [imageId, currentObjectPosition, updateImage],
  );

  const imageCount = images?.length;

  const stableImageRecordGetter = useEffectEvent((imageId: ImageId) => {
    return images?.find((image) => image.id === imageId);
  });

  const [imageNotFound, setImageNotFound] = useState(false);

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
        if (imageId == null || persistenceMode === "ephemeral") return;

        if (imageCount == null) {
          console.log("database is loading");
          safeSetImage(null);
          return;
        }

        if (imageCount === 0) {
          console.log("database is empty");
          safeSetImage(null);
          return;
        }

        const imageRecord = stableImageRecordGetter(imageId);

        if (imageRecord == null) {
          console.log("image not found in the database");
          safeSetImage(null);
          setImageNotFound(true);
          return;
        }

        const result = await createImageStateFromRecord(imageRecord);

        if (result.rejected != null) {
          safeSetImage(null);
          toast.error(`Error loading saved image: ${String(result.rejected.reason)}`);
          return;
        }

        const nextImageState = result.accepted;
        safeSetImage(nextImageState);
        setAspectRatio(nextImageState.naturalAspectRatio ?? DEFAULT_ASPECT_RATIO);
        console.log("loaded image from record", imageRecord);
      }

      asyncSetImageState();
    },
    { timeout: IMAGE_LOAD_DEBOUNCE_MS },
    [imageId, imageCount, persistenceMode, setAspectRatio],
  );

  const pageState = usePageState({ persistenceMode, imageId, image });

  return (
    <>
      <FullScreenDropZone onImageUpload={handleImageUpload} onImageUploadError={noop} />
      <EditorGrid>
        {pageState === "landing" ? (
          <Landing
            uploaderButtonRef={uploaderButtonRef}
            onImageUpload={handleImageUpload}
            onImageUploadError={noop}
          />
        ) : pageState === "editing" && image != null ? (
          <>
            {aspectRatio != null && (
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
        ) : pageState === "pageNotFound" ? (
          <h3 style={{ gridColumn: "1 / -1", gridRow: "1 / -2", margin: "auto" }}>
            Page not found...
          </h3>
        ) : pageState === "imageNotFound" ? (
          <h3 style={{ gridColumn: "1 / -1", gridRow: "1 / -2", margin: "auto" }}>
            Image not found...
          </h3>
        ) : (
          <h3 style={{ gridColumn: "1 / -1", gridRow: "1 / -2", margin: "auto" }}>
            Critical error...
          </h3>
        )}
        {pageState === "editing" || pageState === "imageNotFound" ? (
          <>
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
            <ImageUploaderButton
              ref={uploaderButtonRef}
              onImageUpload={handleImageUpload}
              onImageUploadError={noop}
            />
          </>
        ) : null}
      </EditorGrid>
    </>
  );
}
