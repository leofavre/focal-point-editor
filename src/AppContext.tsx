import type { Dispatch, PropsWithChildren, RefObject, SetStateAction } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import useDebouncedEffect from "use-debounced-effect";
import { useDelayedState } from "use-delay-follow-state";
import { createImageStateFromDraftAndFile } from "./pages/helpers/createImageStateFromDraftAndFile";
import { createImageStateFromRecord } from "./pages/helpers/createImageStateFromRecord";
import { createImageStateFromUrl } from "./pages/helpers/createImageStateFromUrl";
import { createKeyboardShortcutHandler } from "./pages/helpers/createKeyboardShortcutHandler";
import { usePageState } from "./pages/hooks/usePageState";
import { usePersistedImages } from "./pages/hooks/usePersistedImages";
import { usePersistedUIRecord } from "./pages/hooks/usePersistedUIRecord";
import type {
  CodeSnippetLanguage,
  ImageDraftStateAndFile,
  ImageDraftStateAndUrl,
  ImageId,
  ImageRecord,
  ImageState,
  ObjectPositionString,
  UIPageState,
  UIPersistenceMode,
} from "./types";
import { hasUrl, isImageDraftStateAndUrl } from "./types";

const DEFAULT_SHOW_FOCAL_POINT = false;
const DEFAULT_SHOW_IMAGE_OVERFLOW = false;
const DEFAULT_SHOW_CODE_SNIPPET = false;
const DEFAULT_CODE_SNIPPET_LANGUAGE: CodeSnippetLanguage = "html";
const DEFAULT_ASPECT_RATIO = 1;
const INTERACTION_DEBOUNCE_MS = 500;
const MINIMAL_LOADING_DURATION_MS = 250;
const SINGLE_IMAGE_MODE_ID = "edit" as ImageId;

const PERSISTENCE_MODE: UIPersistenceMode = "singleImage";

const noop = () => {};

export type EditorContextValue = {
  persistenceMode: UIPersistenceMode;
  imageId: ImageId | undefined;
  image: ImageState | null;
  images: ImageRecord[] | undefined;
  imageCount: number | undefined;
  aspectRatio: number | undefined;
  setAspectRatio: Dispatch<SetStateAction<number | undefined>>;
  showFocalPoint: boolean | undefined;
  setShowFocalPoint: Dispatch<SetStateAction<boolean | undefined>>;
  showImageOverflow: boolean | undefined;
  setShowImageOverflow: Dispatch<SetStateAction<boolean | undefined>>;
  showCodeSnippet: boolean;
  setShowCodeSnippet: Dispatch<SetStateAction<boolean>>;
  codeSnippetLanguage: CodeSnippetLanguage | undefined;
  setCodeSnippetLanguage: Dispatch<SetStateAction<CodeSnippetLanguage | undefined>>;
  codeSnippetCopied: boolean;
  setCodeSnippetCopied: Dispatch<SetStateAction<boolean>>;
  currentObjectPosition: ObjectPositionString | undefined;
  pageState: UIPageState;
  isLoading: boolean;
  isEditingSingleImage: boolean;
  showBottomBar: boolean;
  handleImageUpload: (
    draftAndFileOrUrl: ImageDraftStateAndFile | ImageDraftStateAndUrl | undefined,
  ) => Promise<void>;
  handleImageError: () => void;
  handleObjectPositionChange: (objectPosition: ObjectPositionString) => void;
  uploaderButtonRef: RefObject<HTMLButtonElement | null>;
};

const EditorContext = createContext<EditorContextValue | null>(null);

/**
 * Derives imageId from the current pathname. "/" yields undefined, "/edit" yields "edit".
 */
function getImageIdFromPathname(pathname: string): ImageId | undefined {
  const segment = pathname.slice(1).trim();
  return segment === "" ? undefined : (segment as ImageId);
}

export function AppContext({ children }: PropsWithChildren) {
  const persistenceMode = PERSISTENCE_MODE;
  const uploaderButtonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();
  const imageId = getImageIdFromPathname(pathname);
  const navigate = useNavigate();

  const { images, addImage, updateImage } = usePersistedImages({
    onRefreshImagesError: noop,
  });

  const [image, setImage] = useState<ImageState | null>(null);

  const safeSetImage = useEffectEvent(
    (valueOrFn: ImageState | null | ((prev: ImageState | null) => ImageState | null)) => {
      setImage((prevValue) => {
        const nextValue = typeof valueOrFn === "function" ? valueOrFn(prevValue) : valueOrFn;

        if (prevValue != null && prevValue.url !== nextValue?.url) {
          if (prevValue.url.startsWith("blob:")) {
            URL.revokeObjectURL(prevValue.url);
          }
        }

        return nextValue;
      });
    },
  );

  const [aspectRatio, setAspectRatio] = usePersistedUIRecord(
    { id: "aspectRatio", value: DEFAULT_ASPECT_RATIO },
    { debounceTimeout: INTERACTION_DEBOUNCE_MS },
  );

  const [showFocalPoint, setShowFocalPoint] = usePersistedUIRecord({
    id: "showFocalPoint",
    value: DEFAULT_SHOW_FOCAL_POINT,
  });

  const [showImageOverflow, setShowImageOverflow] = usePersistedUIRecord({
    id: "showImageOverflow",
    value: DEFAULT_SHOW_IMAGE_OVERFLOW,
  });

  const [codeSnippetLanguage, setCodeSnippetLanguage] = usePersistedUIRecord({
    id: "codeSnippetLanguage",
    value: DEFAULT_CODE_SNIPPET_LANGUAGE,
  });

  const [showCodeSnippet, setShowCodeSnippet] = useState(DEFAULT_SHOW_CODE_SNIPPET);
  const [codeSnippetCopied, setCodeSnippetCopied] = useState(false);
  const [isProcessingImageUpload, setIsProcessingImageUpload] = useState(false);
  const [imageNotFoundConfirmed, setImageNotFoundConfirmed] = useState(false);

  const currentObjectPosition = image?.breakpoints?.[0]?.objectPosition;
  const imageCount = images?.length;

  const stableImageRecordGetter = useEffectEvent((id: ImageId) => {
    return images?.find((img) => img.id === id);
  });

  const isEditingSingleImage =
    persistenceMode === "singleImage" && imageId === SINGLE_IMAGE_MODE_ID;

  const pageState = usePageState({
    persistenceMode,
    imageId,
    image,
    isEditingSingleImage,
  });

  const [isLoading, setIsLoading] = useDelayedState(pageState === "imageNotFound");

  const handleImageUpload = useCallback(
    async (draftAndFileOrUrl: ImageDraftStateAndFile | ImageDraftStateAndUrl | undefined) => {
      if (draftAndFileOrUrl == null) return;

      setIsProcessingImageUpload(true);

      const imageStateResult = isImageDraftStateAndUrl(draftAndFileOrUrl)
        ? await createImageStateFromUrl(draftAndFileOrUrl)
        : await createImageStateFromDraftAndFile(draftAndFileOrUrl);

      if (imageStateResult.rejected != null) {
        toast.error(`Error creating image state: ${String(imageStateResult.rejected.reason)}`);
        setIsProcessingImageUpload(false);
        return;
      }

      safeSetImage(imageStateResult.accepted);
      setAspectRatio(imageStateResult.accepted.naturalAspectRatio ?? DEFAULT_ASPECT_RATIO);

      const addResult = await addImage(draftAndFileOrUrl, {
        id: persistenceMode === "singleImage" ? SINGLE_IMAGE_MODE_ID : undefined,
      });

      const nextImageId = addResult.accepted;
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

  useEffect(() => {
    return () => {
      safeSetImage(null);
    };
  }, []);

  useEffect(() => {
    void currentObjectPosition;
    setCodeSnippetCopied(false);
  }, [currentObjectPosition]);

  useEffect(() => {
    void codeSnippetLanguage;
    setCodeSnippetCopied(false);
  }, [codeSnippetLanguage]);

  useEffect(() => {
    document.body.style.overflow = pageState !== "landing" ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [pageState]);

  /**
   * Handles all keyboard shortcuts:
   * - 'u' opens the file input to upload a new image.
   * - 'a' or 'f' toggles the focal point.
   * - 's' or 'o' toggles the image overflow.
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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setShowFocalPoint, setShowImageOverflow]);

  useDebouncedEffect(
    () => {
      if (imageId == null || currentObjectPosition == null) return;

      updateImage(imageId, {
        breakpoints: [{ objectPosition: currentObjectPosition }],
      }).then((result) => {
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

  useDebouncedEffect(
    () => {
      if (imageId == null || aspectRatio == null) return;

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

  useEffect(() => {
    async function asyncSetImageState() {
      if (imageId == null) return;

      if (imageCount == null) {
        console.log("persistence layer is loading");
        safeSetImage(null);
        return;
      }

      if (imageCount === 0) {
        console.log("persistence layer is empty");
        safeSetImage(null);
        setImageNotFoundConfirmed(true);
        return;
      }

      const imageRecord = stableImageRecordGetter(imageId);

      if (imageRecord == null) {
        console.log("image not found in the persistence layer");
        safeSetImage(null);
        setImageNotFoundConfirmed(true);
        return;
      }

      const result = hasUrl(imageRecord)
        ? await createImageStateFromUrl({
            imageDraft: {
              name: imageRecord.name,
              type: imageRecord.type,
              createdAt: imageRecord.createdAt,
              breakpoints: imageRecord.breakpoints,
            },
            url: imageRecord.url,
          })
        : await createImageStateFromRecord(imageRecord);

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
  }, [imageId, imageCount, setAspectRatio]);

  useEffect(() => {
    const loading =
      isProcessingImageUpload ||
      (pageState === "imageNotFound" && imageNotFoundConfirmed === false);

    setIsLoading(loading, !loading ? MINIMAL_LOADING_DURATION_MS : 0);
  }, [setIsLoading, pageState, imageNotFoundConfirmed, isProcessingImageUpload]);

  const showBottomBar = true; /* !isLoading && (pageState === "editing" || pageState === "imageNotFound"); */

  const value: EditorContextValue = {
    persistenceMode,
    imageId,
    image,
    images,
    imageCount,
    aspectRatio,
    setAspectRatio,
    showFocalPoint,
    setShowFocalPoint,
    showImageOverflow,
    setShowImageOverflow,
    showCodeSnippet,
    setShowCodeSnippet,
    codeSnippetLanguage,
    setCodeSnippetLanguage,
    codeSnippetCopied,
    setCodeSnippetCopied,
    currentObjectPosition,
    pageState,
    isLoading,
    isEditingSingleImage,
    showBottomBar,
    handleImageUpload,
    handleImageError,
    handleObjectPositionChange,
    uploaderButtonRef,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
}

export function useEditorContext(): EditorContextValue {
  const context = useContext(EditorContext);
  if (context == null) {
    throw new Error("useEditorContext must be used within EditorContextProvider");
  }
  return context;
}
