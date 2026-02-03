import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useDebouncedEffect from "use-debounced-effect";
import { ReactComponent as ReadmeContent } from "../../README.md";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { useAspectRatioList } from "../components/AspectRatioSlider/hooks/useAspectRatioList";
import { CodeSnippet } from "../components/CodeSnippet/CodeSnippet";
import { FocalPointEditor } from "../components/FocalPointEditor/FocalPointEditor";
import { ImageUploader } from "../components/ImageUploader/ImageUploader";
import { Markdown } from "../components/Markdown/Markdown";
import { ToggleBar } from "../components/ToggleBar/ToggleBar";
import { ToggleButton } from "../components/ToggleButton/ToggleButton";
import { CodeSnippetToggleIcon } from "../icons/CodeSnippetToggleIcon";
import { GhostImageToggleIcon } from "../icons/GhostImageToggleIcon";
import { PointMarkerToggleIcon } from "../icons/PointMarkerToggleIcon";
import type { ImageDraftStateAndFile, ImageState, ObjectPositionString } from "../types";
import { EditorGrid } from "./Editor.styled";
import { createImageStateFromImageRecord } from "./helpers/createImageStateFromImageRecord";
import { createKeyboardShortcutHandler } from "./helpers/createKeyboardShortcutHandler";
import { usePersistedImages } from "./hooks/usePersistedImages";
import { usePersistedUIRecord } from "./hooks/usePersistedUIRecord";
import { LandingGrid } from "./Landing.styled";

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
 * ### MELHORIZE™ UI.
 *
 * - Adjust container query for ImageUploader when rendered on mobile pages.
 * - Make shure focus is visible, specially in AspectRatioSlider.
 * - Add integration tests (which tool to use?).
 * - Think about animations and transitions.
 *
 * ### Basic functionality
 *
 * - Handle loading.
 * - Handle errors in a consistent way. Review all try/catch blocks.
 *
 * ### Advanced functionality
 *
 * - Breakpoints with container queries.
 * - Maybe make a browser extension?
 * - Maybe make a React component?
 * - Maybe make a native custom element?
 */
export default function Editor() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { imageId } = useParams<{ imageId: string }>();
  const [image, setImage] = useState<ImageState | null>(null);
  const { images, addImage, updateImage } = usePersistedImages();

  /**
   * Safely set image state. Revokes the previous blob URL if the new blob URL is different.
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
    { debounceTimeout: INTERACTION_DEBOUNCE_MS },
  );

  const [showPointMarker, setShowPointMarker] = usePersistedUIRecord({
    id: "showPointMarker",
    value: DEFAULT_SHOW_POINT_MARKER,
  });

  const [showGhostImage, setShowGhostImage] = usePersistedUIRecord({
    id: "showGhostImage",
    value: DEFAULT_SHOW_GHOST_IMAGE,
  });

  const [showCodeSnippet, setShowCodeSnippet] = usePersistedUIRecord({
    id: "showCodeSnippet",
    value: DEFAULT_SHOW_CODE_SNIPPET,
  });

  const [codeSnippetLanguage, setCodeSnippetLanguage] = usePersistedUIRecord({
    id: "codeSnippetLanguage",
    value: DEFAULT_CODE_SNIPPET_LANGUAGE,
  });

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
   * Handle all keyboard shortcuts:
   * - 'u' opens the file input to upload a new image.
   * - 'a' or 'p' toggles the point marker.
   * - 's' or 'l' toggles the ghost image.
   * - 'd' or 'c' toggles the code snippet.
   *
   * The shortcuts are case insensitive.
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

  useEffect(() => {
    void currentObjectPosition;
    setCodeSnippetCopied(false);
  }, [currentObjectPosition]);

  useEffect(() => {
    void codeSnippetLanguage;
    setCodeSnippetCopied(false);
  }, [codeSnippetLanguage]);

  /**
   * Update the object position of the image in the database when the user interacts with it
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
   * Load the image record from the database when the page is loaded or the database is
   * refreshed. A debounce is used because both events can happen almost at the same time.
   *
   * After the image record is loaded, the image state is created with a new blob URL and
   * the calculated natural aspect ratio.
   */
  useDebouncedEffect(
    () => {
      async function asyncSetImageState() {
        if (imageCount === 0) return;

        if (imageId == null) {
          safeSetImage(null);
          return;
        }

        const imageRecord = stableImageRecordGetter(imageId);

        if (imageRecord == null) return;

        try {
          const nextImageState = await createImageStateFromImageRecord(imageRecord);
          safeSetImage(nextImageState);
          console.log("loaded image from record", imageRecord);
          /** @todo early return if the user has refreshed the page. how to detect? */
          setAspectRatio(nextImageState.naturalAspectRatio ?? DEFAULT_ASPECT_RATIO);
        } catch (error) {
          safeSetImage(null);
          console.error("Error loading saved image:", error);
        }
      }

      asyncSetImageState();
    },
    { timeout: IMAGE_LOAD_DEBOUNCE_MS },
    [imageId, imageCount],
  );

  /**
   * @todo
   *
   * ### Handle states
   *
   * - `!imageId` means that we are on the landing page.
   * - `imageId && !image` means that the image is either loading or not found.
   */
  if (!imageId) {
    return (
      <LandingGrid>
        <ImageUploader ref={fileInputRef} onImageUpload={handleImageUpload} />
        <Markdown>
          <ReadmeContent />
        </Markdown>
      </LandingGrid>
    );
  }

  if (imageId && !image) {
    return (
      <LandingGrid>
        <ImageUploader ref={fileInputRef} onImageUpload={handleImageUpload} />
        <Markdown>
          <ReadmeContent />
        </Markdown>
      </LandingGrid>
    );
  }

  return (
    <EditorGrid>
      <ImageUploader ref={fileInputRef} onImageUpload={handleImageUpload} />
      <ToggleBar>
        {showPointMarker != null && (
          <ToggleButton
            toggled={showPointMarker}
            onToggle={() => setShowPointMarker((prev) => !prev)}
            titleOn="Hide pointer marker"
            titleOff="Show pointer marker"
            icon={<PointMarkerToggleIcon />}
          />
        )}
        {showGhostImage != null && (
          <ToggleButton
            toggled={showGhostImage}
            onToggle={() => setShowGhostImage((prev) => !prev)}
            titleOn="Hide ghost image"
            titleOff="Show ghost image"
            icon={<GhostImageToggleIcon />}
          />
        )}
        {showCodeSnippet != null && (
          <ToggleButton
            toggled={showCodeSnippet}
            onToggle={() => setShowCodeSnippet((prev) => !prev)}
            titleOn="Hide code snippet"
            titleOff="Show code snippet"
            icon={<CodeSnippetToggleIcon />}
          />
        )}
      </ToggleBar>
      {image && (
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
          <CodeSnippet
            src={image.name}
            objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
            language={codeSnippetLanguage ?? DEFAULT_CODE_SNIPPET_LANGUAGE}
            onLanguageChange={setCodeSnippetLanguage}
            copied={codeSnippetCopied}
            onCopiedChange={setCodeSnippetCopied}
            css={{
              opacity: showCodeSnippet ? 1 : 0,
              pointerEvents: showCodeSnippet ? "auto" : "none",
            }}
          />
        </>
      )}
      <AspectRatioSlider
        aspectRatio={aspectRatio}
        aspectRatioList={aspectRatioList}
        onAspectRatioChange={setAspectRatio}
      />
    </EditorGrid>
  );
}
