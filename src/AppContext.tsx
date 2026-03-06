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
import { navigate as vikeNavigate } from "vike/client/router";
import { usePageContext } from "vike-react/usePageContext";
import { copyTextToClipboardWithToast } from "@/components/CodeSnippet/helpers/copyToClipboard";
import { getCodeSnippet } from "@/components/CodeSnippet/helpers/getCodeSnippet";
import { createImageStateFromDraftAndFile } from "./editor/helpers/createImageStateFromDraftAndFile";
import { createImageStateFromRecord } from "./editor/helpers/createImageStateFromRecord";
import { createImageStateFromUrl } from "./editor/helpers/createImageStateFromUrl";
import { createKeyboardShortcutHandler } from "./editor/helpers/createKeyboardShortcutHandler";
import { usePersistedImages } from "./editor/hooks/usePersistedImages";
import { usePersistedUIRecord } from "./editor/hooks/usePersistedUIRecord";
import { logError } from "./helpers/errorHandling";
import { getCreateImageStateErrorMessage } from "./helpers/getCreateImageStateErrorMessage";
import { shouldHideBodyOverflow } from "./helpers/shouldHideBodyOverflow";
import { useDebouncedEffect } from "./hooks/useDebouncedEffect";
import type {
  CodeSnippetLanguage,
  ImageDraftStateAndFile,
  ImageDraftStateAndUrl,
  ImageId,
  ImageRecord,
  ImageState,
  ObjectPositionString,
  UIPersistenceMode,
} from "./types";
import { hasUrl, isImageDraftStateAndUrl } from "./types";

const DEFAULT_SHOW_FOCAL_POINT = false;
const DEFAULT_SHOW_IMAGE_OVERFLOW = false;
const DEFAULT_SHOW_CODE_SNIPPET = false;
const DEFAULT_CODE_SNIPPET_LANGUAGE: CodeSnippetLanguage = "html";
const DEFAULT_ASPECT_RATIO = 1;
const INTERACTION_DEBOUNCE_MS = 500;
const SINGLE_IMAGE_MODE_ID = "edit" as ImageId;

const PERSISTENCE_MODE: UIPersistenceMode = "singleImage";

export type EditorContextValue = {
  pathname: string;
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
  currentObjectPosition: ObjectPositionString | undefined;
  imageNotFoundConfirmed: boolean;
  isLoading: boolean;
  isEditingSingleImage: boolean;
  showBottomBar: boolean;
  handleImageUpload: (
    draftAndFileOrUrl: ImageDraftStateAndFile | ImageDraftStateAndUrl | undefined,
  ) => Promise<void>;
  handleImageError: () => void;
  handleObjectPositionChange: (objectPosition: ObjectPositionString) => void;
  uploaderButtonRef: RefObject<HTMLButtonElement | null>;
  focalPointImageRef: RefObject<HTMLDivElement | null>;
  aspectRatioSliderRef: RefObject<HTMLInputElement | null>;
};

const EditorContext = createContext<EditorContextValue | null>(null);

const IMAGE_ROUTE_PREFIX = "/image/";

/**
 * Derives imageId from the current pathname. Only "/image/:imageId" yields an id; "/" or other paths yield undefined.
 */
function getImageIdFromPathname(pathname: string): ImageId | undefined {
  if (!pathname.startsWith(IMAGE_ROUTE_PREFIX) || pathname.length <= IMAGE_ROUTE_PREFIX.length) {
    return undefined;
  }
  const segment = pathname.slice(IMAGE_ROUTE_PREFIX.length).trim();
  return segment === "" ? undefined : (segment as ImageId);
}

export function AppContext({ children }: PropsWithChildren) {
  const persistenceMode = PERSISTENCE_MODE;
  const uploaderButtonRef = useRef<HTMLButtonElement>(null);
  const focalPointImageRef = useRef<HTMLDivElement>(null);
  const aspectRatioSliderRef = useRef<HTMLInputElement>(null);
  const pageContext = usePageContext();
  const pathname = pageContext?.urlPathname ?? "";
  const imageId = getImageIdFromPathname(pathname);
  const navigate = useCallback((url: string) => {
    vikeNavigate(url);
  }, []);

  const { images, addImage, updateImage } = usePersistedImages({
    onRefreshImagesError: logError,
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
    { debounceTimeout: INTERACTION_DEBOUNCE_MS, onError: logError },
  );

  const [showFocalPoint, setShowFocalPoint] = usePersistedUIRecord(
    { id: "showFocalPoint", value: DEFAULT_SHOW_FOCAL_POINT },
    { onError: logError },
  );

  const [showImageOverflow, setShowImageOverflow] = usePersistedUIRecord(
    { id: "showImageOverflow", value: DEFAULT_SHOW_IMAGE_OVERFLOW },
    { onError: logError },
  );

  const [codeSnippetLanguage, setCodeSnippetLanguage] = usePersistedUIRecord(
    { id: "codeSnippetLanguage", value: DEFAULT_CODE_SNIPPET_LANGUAGE },
    { onError: logError },
  );

  const [showCodeSnippet, setShowCodeSnippet] = useState(DEFAULT_SHOW_CODE_SNIPPET);
  const [isProcessingImageUpload, setIsProcessingImageUpload] = useState(false);
  const [imageNotFoundConfirmed, setImageNotFoundConfirmed] = useState(false);

  const currentObjectPosition = image?.breakpoints?.[0]?.objectPosition;
  const imageCount = images?.length;

  const stableImageRecordGetter = useEffectEvent((id: ImageId) => {
    return images?.find((img) => img.id === id);
  });

  const isEditingSingleImage =
    persistenceMode === "singleImage" && imageId === SINGLE_IMAGE_MODE_ID;

  const isEditingRoute = /^\/image\/[^/]+$/.test(pathname);
  const isOnImageRoute = pathname.startsWith(IMAGE_ROUTE_PREFIX);

  const handleImageUpload = useCallback(
    async (draftAndFileOrUrl: ImageDraftStateAndFile | ImageDraftStateAndUrl | undefined) => {
      if (draftAndFileOrUrl == null) return;

      setIsProcessingImageUpload(true);

      const imageStateResult = isImageDraftStateAndUrl(draftAndFileOrUrl)
        ? await createImageStateFromUrl(draftAndFileOrUrl)
        : await createImageStateFromDraftAndFile(draftAndFileOrUrl);

      if (imageStateResult.rejected != null) {
        toast.error(getCreateImageStateErrorMessage(imageStateResult.rejected.reason));
        setIsProcessingImageUpload(false);
        return;
      }

      safeSetImage(imageStateResult.accepted);
      setAspectRatio(imageStateResult.accepted.naturalAspectRatio ?? DEFAULT_ASPECT_RATIO);

      const addResult = await addImage(draftAndFileOrUrl, {
        id: persistenceMode === "singleImage" ? SINGLE_IMAGE_MODE_ID : undefined,
      });

      if (addResult.rejected != null) {
        logError(addResult.rejected);
      }

      const nextImageId = addResult.accepted;
      const shouldNavigate = nextImageId != null && imageId !== nextImageId;

      if (shouldNavigate) {
        await navigate(`/image/${nextImageId}`);
        console.log(
          "navigated from",
          `/image/${imageId ?? ""}`,
          "to",
          `/image/${nextImageId ?? ""}`,
        );
      }

      setIsProcessingImageUpload(false);
    },
    [persistenceMode, addImage, navigate, setAspectRatio, imageId],
  );

  const handleImageError = useCallback(() => {
    toast.error("Failed to load image");
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
    const hideOverflow = shouldHideBodyOverflow(pathname);
    document.body.classList.toggle("no-overflow", hideOverflow);
    return () => document.body.classList.remove("no-overflow");
  }, [pathname]);

  /**
   * Handles all keyboard shortcuts:
   * - 'e' focuses the image.
   * - 'a' toggles the focal point.
   * - 's' toggles the image overflow.
   * - 'd' focuses the aspect ratio slider.
   * - 'f' opens the code snippet (does not toggle).
   * - 'g', 'u', 'i' open the file input to upload a new image.
   * - 'c' copies the code snippet directly (without opening the dialog).
   *
   * The shortcuts are case insensitive and are not triggered
   * when modified with meta keys like Control or Command.
   */
  useEffect(() => {
    const handleCopyCodeSnippet = () => {
      const imageName = image?.name;
      const objectPosition = currentObjectPosition ?? (image != null ? "50% 50%" : undefined);
      const language = codeSnippetLanguage ?? DEFAULT_CODE_SNIPPET_LANGUAGE;

      if (imageName == null || objectPosition == null) return;

      const snippet = getCodeSnippet({ language, src: imageName, objectPosition });
      copyTextToClipboardWithToast(snippet);
    };

    const handleKeyDown = createKeyboardShortcutHandler({
      e: () => {
        focalPointImageRef.current?.focus();
      },
      a: () => {
        setShowFocalPoint((prev) => !prev);
      },
      s: () => {
        setShowImageOverflow((prev) => !prev);
      },
      d: () => {
        aspectRatioSliderRef.current?.focus();
      },
      f: () => {
        setShowCodeSnippet(true);
      },
      g: () => {
        uploaderButtonRef.current?.click();
      },
      u: () => {
        uploaderButtonRef.current?.click();
      },
      i: () => {
        uploaderButtonRef.current?.click();
      },
      c: handleCopyCodeSnippet,
    });

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, [image, currentObjectPosition, codeSnippetLanguage, setShowFocalPoint, setShowImageOverflow]);

  useDebouncedEffect(
    () => {
      if (imageId == null || currentObjectPosition == null) return;

      updateImage(imageId, {
        breakpoints: [{ objectPosition: currentObjectPosition }],
      }).then((result) => {
        if (result.rejected != null) {
          logError(result.rejected);
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
          logError(result.rejected);
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
        toast.error(getCreateImageStateErrorMessage(result.rejected.reason));
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

  const isUnknownRoute = pathname !== "/" && pathname !== "/privacy" && !isEditingRoute;

  const isLoading =
    isProcessingImageUpload || (isOnImageRoute && image == null && !imageNotFoundConfirmed);

  const showBottomBar =
    (isEditingRoute && showFocalPoint != null && showImageOverflow != null) || isUnknownRoute;

  const value: EditorContextValue = {
    pathname,
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
    currentObjectPosition,
    imageNotFoundConfirmed,
    isLoading,
    isEditingSingleImage,
    showBottomBar,
    handleImageUpload,
    handleImageError,
    handleObjectPositionChange,
    uploaderButtonRef,
    focalPointImageRef,
    aspectRatioSliderRef,
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
