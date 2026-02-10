import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
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
import type { ImageDraftStateAndFile, ImageId, ImageState, ObjectPositionString } from "../types";
import { EditorGrid } from "./Editor.styled";
import { createImageStateFromDraftAndFile } from "./helpers/createImageStateFromDraftAndFile";
import { createImageStateFromRecord } from "./helpers/createImageStateFromRecord";
import { createKeyboardShortcutHandler } from "./helpers/createKeyboardShortcutHandler";
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

const noop = () => {};

/**
 * @todo
 *
 * ### MELHORIZE™ UI.
 *
 * - Verify accessibility.
 * - Review aria labels.
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
 * - Fix app not working in Incognito mode on mobile Chrome. Maybe fixed by no relying on IndexedDB?
 * - Fix bug where uploading a new image show the aspect ratio from the previous image before changing it.
 * - Fix bug where using the browser arrow to go back to the landing page does not work.
 * - Remove all deprecated and dead code.
 * - For study, use an opaque type for the image id.
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
  const uploaderButtonRef = useRef<HTMLButtonElement>(null);
  const isFirstImageLoadInSessionRef = useRef(true);

  const { imageId } = useParams<{ imageId: ImageId }>();
  const [image, setImage] = useState<ImageState | null>(null);
  const { images, addImage, updateImage } = usePersistedImages();

  /**
   * @todo To rethink the loading state, consider the following:
   * - `imageId` always come from the URL.
   * - `imageId` can be undefined if:
   *    - the user is on the landing page.
   *    - an image was not saved to the database on purpose in ephemeral mode.
   * - I guess I need to set which mode the app is running in: ephemeral or persistent.
   * - If the app is in persistent mode, has an `imageId` and still the image was not
   * loaded, then we have a "not found..." error.
   */
  const [isLoading] = useState(false);

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
        console.error("Error creating image state:", imageStateResult.rejected.reason);
        return;
      }

      /**
       * The image is set before it's added to the database. This guarantees that the app
       * works even without persistent storage. The worst case scenario is the user hitting
       * refresh and losing the image and the current object position.
       */
      safeSetImage(imageStateResult.accepted);

      const addResult = await addImage({ imageDraft, file });

      if (addResult.accepted != null) {
        console.log("saved image with id", addResult.accepted);
        await navigate(`/${addResult.accepted}`);
        console.log("navigated to", `/${addResult.accepted}`);
      }
    },
    [addImage, navigate],
  );

  const handleImageError = useCallback(() => {
    /**
     * @todo Maybe show error to the user in the UI.
     */
    console.error("Error uploading image");
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
          console.error("Error saving position to database:", result.rejected.reason);
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

  const imageCount = images?.length ?? 0;

  const stableImageRecordGetter = useEffectEvent((imageId: ImageId) => {
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
        /**
         * Landing page or ephemeral mode.
         */
        if (imageId == null) return;

        /**
         * @todo
         *
         * Either there are no images in the database or the database is still loading:
         * - If it has loaded, then the image record will not be found in the database.
         *   Show error to the user and the spinner stops.
         * - If it hasn't loaded yet. Show spinner.
         */
        if (imageCount === 0) {
          safeSetImage(null);
          return;
        }

        const imageRecord = stableImageRecordGetter(imageId);

        /**
         * @todo
         *
         * Image record not found in the database.
         * Show error to the user and the spinner stops.
         */
        if (imageRecord == null) {
          safeSetImage(null);
          return;
        }

        const result = await createImageStateFromRecord(imageRecord);

        /**
         * @todo
         *
         * Image could not be loaded from the database.
         * Show error to the user and the spinner stops.
         */
        if (result.rejected != null) {
          safeSetImage(null);
          console.error("Error loading saved image:", result.rejected.reason);
          return;
        }

        /**
         * @todo
         *
         * All went fine. Spinner stops.
         */
        const nextImageState = result.accepted;
        safeSetImage(nextImageState);
        console.log("loaded image from record", imageRecord);

        /**
         * @todo
         *
         * Fix the bug where the spinner is not reset after an upload.
         */
        if (isFirstImageLoadInSessionRef.current) {
          isFirstImageLoadInSessionRef.current = false;
          return;
        }

        setAspectRatio(nextImageState.naturalAspectRatio ?? DEFAULT_ASPECT_RATIO);
      }

      asyncSetImageState();
    },
    { timeout: IMAGE_LOAD_DEBOUNCE_MS },
    [imageId, imageCount],
  );

  /**
   * @todo Handle all onImageUploadErrors.
   */
  if (!imageId && !image) {
    return (
      <>
        <FullScreenDropZone onImageUpload={handleImageUpload} onImageUploadError={noop} />
        <EditorGrid>
          <Landing
            uploaderButtonRef={uploaderButtonRef}
            onImageUpload={handleImageUpload}
            onImageUploadError={noop}
          />
        </EditorGrid>
      </>
    );
  }

  return (
    <>
      <FullScreenDropZone onImageUpload={handleImageUpload} onImageUploadError={noop} />
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
        <ImageUploaderButton
          ref={uploaderButtonRef}
          onImageUpload={handleImageUpload}
          onImageUploadError={noop}
        />
      </EditorGrid>
    </>
  );
}
