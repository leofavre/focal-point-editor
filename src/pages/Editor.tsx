import styled from "@emotion/styled";
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import useDebouncedEffect from "use-debounced-effect";
import { useDelayedState } from "use-delay-follow-state";
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
import { isIndexedDBAvailable } from "../helpers/indexedDBAvailability";
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
const MINIMAL_LOADING_DURATION_MS = 250;
const SINGLE_IMAGE_MODE_ID = "edit" as ImageId;

/**
 * @todo Maybe add persistence as a feature? Maybe add to an environment variable?
 */
const PERSISTENCE_MODE: UIPersistenceMode = isIndexedDBAvailable() ? "singleImage" : "ephemeral";

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
 * - Fix weird shadow in buttons.
 * - Remove all deprecated and dead code.
 *
 * ### DevOps
 *
 * - Fix broken pre-release pipeline. Maybe add PAT?
 * - Control cache invalidation, given it's a PWA.
 * - Add Storybook tests (to see how it works?).
 *
 * ### Advanced functionality
 *
 * - Support external image sources.
 * - Breakpoints with container queries.
 * - Multiple images with "file system".
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
    enabled: persistenceMode !== "ephemeral",
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

  const [isProcessingImageUpload, setIsProcessingImageUpload] = useState(false);

  const handleImageUpload = useCallback(
    async (draftAndFile: ImageDraftStateAndFile | undefined) => {
      if (draftAndFile == null) return;

      setIsProcessingImageUpload(true);

      const { imageDraft, file } = draftAndFile;

      const imageStateResult = await createImageStateFromDraftAndFile(draftAndFile);

      /**
       * @todo Maybe show error to the user in the UI.
       */
      if (imageStateResult.rejected != null) {
        toast.error(`Error creating image state: ${String(imageStateResult.rejected.reason)}`);
        setIsProcessingImageUpload(false);
        return;
      }

      /**
       * The image is set before it's added to the database. This guarantees that the app
       * works even without persistent storage. The worst case scenario is the user hitting
       * refresh and losing the image and the current object position.
       */
      safeSetImage(imageStateResult.accepted);
      setAspectRatio(imageStateResult.accepted.naturalAspectRatio ?? DEFAULT_ASPECT_RATIO);

      if (persistenceMode === "ephemeral") {
        setIsProcessingImageUpload(false);
        return;
      }

      /**
       * When in single image mode, the image is added with the explicit id "edit".
       * This will cause the database to store a single image and the editor url will be "/edit".
       */
      const addResult = await addImage(
        { imageDraft, file },
        { id: persistenceMode === "singleImage" ? SINGLE_IMAGE_MODE_ID : undefined },
      );

      const nextImageId = addResult.accepted;

      /**
       * Only navigate if the imageId has changed, which means that pages are different.
       */
      const shouldNavigate = nextImageId != null && imageId !== nextImageId;

      if (shouldNavigate) {
        await navigate(`/${nextImageId}`);
        console.log("navigated from", `/${imageId ?? ""}`, "to", `/${nextImageId ?? ""}`);
      }

      setIsProcessingImageUpload(false);
    },
    [persistenceMode, addImage, navigate, setAspectRatio, imageId],
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

  /**
   * Persists the current aspect ratio to the image record when the user changes the slider,
   * so it can be restored when reloading the same image.
   */
  useDebouncedEffect(
    () => {
      if (imageId == null || aspectRatio == null || persistenceMode === "ephemeral") return;

      updateImage(imageId, { lastKnownAspectRatio: aspectRatio }).then((result) => {
        if (result.rejected != null) {
          toast.error(`Error saving aspect ratio to database: ${String(result.rejected.reason)}`);
          return;
        }
        if (result.accepted != null) {
          console.log("updated image", imageId, "with lastKnownAspectRatio", aspectRatio);
        }
      });
    },
    { timeout: INTERACTION_DEBOUNCE_MS },
    [imageId, aspectRatio, persistenceMode, updateImage],
  );

  /**
   * Undefined if the database is loading, zero if the database is empty.
   */
  const imageCount = images?.length;

  const stableImageRecordGetter = useEffectEvent((imageId: ImageId) => {
    return images?.find((image) => image.id === imageId);
  });

  const [imageNotFoundConfirmed, setImageNotFoundConfirmed] = useState(false);

  /**
   * Loads the image record from the database when the page is loaded or the database is
   * refreshed. A debounce is used because both events can happen almost at the same time.
   *
   * After the image record is loaded, the image state is created with a new blob URL and
   * the calculated natural aspect ratio.
   */
  useEffect(() => {
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
        setImageNotFoundConfirmed(true);
        return;
      }

      const imageRecord = stableImageRecordGetter(imageId);

      if (imageRecord == null) {
        console.log("image not found in the database");
        safeSetImage(null);
        setImageNotFoundConfirmed(true);
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
      setAspectRatio(
        imageRecord.lastKnownAspectRatio ??
          nextImageState.naturalAspectRatio ??
          DEFAULT_ASPECT_RATIO,
      );
      console.log("loaded image from record", imageRecord);
    }

    asyncSetImageState();
  }, [imageId, imageCount, persistenceMode, setAspectRatio]);

  const isEditingSingleImage =
    persistenceMode === "singleImage" && imageId === SINGLE_IMAGE_MODE_ID;

  const pageState = usePageState({ persistenceMode, imageId, image, isEditingSingleImage });

  const [isLoading, setIsLoading] = useDelayedState(pageState === "imageNotFound");

  useEffect(() => {
    const isLoading =
      isProcessingImageUpload ||
      (pageState === "imageNotFound" && imageNotFoundConfirmed === false);

    setIsLoading(isLoading, !isLoading ? MINIMAL_LOADING_DURATION_MS : 0);
  }, [setIsLoading, pageState, imageNotFoundConfirmed, isProcessingImageUpload]);

  return (
    <>
      <FullScreenDropZone onImageUpload={handleImageUpload} onImageUploadError={noop} />
      <EditorGrid>
        {isLoading ? (
          <Message>Loading...</Message>
        ) : pageState === "landing" ? (
          <Landing
            uploaderButtonRef={uploaderButtonRef}
            onImageUpload={handleImageUpload}
            onImageUploadError={noop}
          />
        ) : pageState === "editing" && image != null && aspectRatio != null ? (
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
          <Message>Page not found...</Message>
        ) : pageState === "imageNotFound" ? (
          <Message>
            {isEditingSingleImage && imageCount === 0
              ? "Start by uploading an image..."
              : "Image not found..."}
          </Message>
        ) : (
          <Message>Critical error...</Message>
        )}
        {pageState === "editing" || pageState === "imageNotFound" ? (
          <>
            <ToggleButton
              type="button"
              data-component="FocalPointButton"
              toggled={showFocalPoint ?? false}
              onToggle={(toggled) => setShowFocalPoint(!toggled)}
              titleOn="Focal point"
              titleOff="Focal point"
              icon={<IconReference />}
            />
            <ToggleButton
              type="button"
              data-component="ImageOverflowButton"
              toggled={showImageOverflow ?? false}
              onToggle={(toggled) => setShowImageOverflow(!toggled)}
              titleOn="Overflow"
              titleOff="Overflow"
              icon={<IconMask />}
            />
            <ToggleButton
              type="button"
              data-component="CodeSnippetButton"
              toggled={showCodeSnippet ?? false}
              onToggle={(toggled) => setShowCodeSnippet(!toggled)}
              titleOn="Code"
              titleOff="Code"
              icon={<IconCode />}
            />
            <ImageUploaderButton
              ref={uploaderButtonRef}
              onImageUpload={handleImageUpload}
              onImageUploadError={noop}
            />
            <AspectRatioSlider
              aspectRatio={aspectRatio}
              aspectRatioList={aspectRatioList}
              onAspectRatioChange={setAspectRatio}
            />
          </>
        ) : null}
      </EditorGrid>
    </>
  );
}

const MessageStyled = styled.h3`
  grid-column: 1 / -1;
  grid-row: 1 / -2;
  margin: auto;
`;

function Message({ children, ...rest }: PropsWithChildren) {
  return <MessageStyled {...rest}>{children}</MessageStyled>;
}
