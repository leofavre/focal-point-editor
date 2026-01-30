import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import useDebouncedEffect from "use-debounced-effect";
import { AspectRatioSlider } from "../../components/AspectRatioSlider/AspectRatioSlider";
import { useAspectRatioList } from "../../components/AspectRatioSlider/hooks/useAspectRatioList";
import { CodeSnippet } from "../../components/CodeSnippet/CodeSnippet";
import { FocusPointEditor } from "../../components/FocusPointEditor/FocusPointEditor";
import { ImageUploader } from "../../components/ImageUploader/ImageUploader";
import { ToggleButton } from "../../components/ToggleButton/ToggleButton";
import { CodeSnippetToggleIcon } from "../../icons/CodeSnippetToggleIcon";
import { GhostImageToggleIcon } from "../../icons/GhostImageToggleIcon";
import { PointMarkerToggleIcon } from "../../icons/PointMarkerToggleIcon";
import type { ObjectPositionString } from "../../types";
import { GeneratorGrid, ToggleBar } from "./Generator.styled";
import { createKeyboardShortcutHandler } from "./helpers/createKeyboardShortcutHandler";
import { useBlobUrl } from "./hooks/useBlobUrl";
import { usePersistedImages } from "./hooks/usePersistedImages";
import { usePersistedUIRecord } from "./hooks/usePersistedUIRecord";
import type { ImageRecord, ImageState } from "./types";

const DEFAULT_SHOW_POINT_MARKER = false;
const DEFAULT_SHOW_GHOST_IMAGE = false;
const DEFAULT_SHOW_CODE_SNIPPET = false;
const DEFAULT_ASPECT_RATIO = 1;
const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";
const INTERACTION_DEBOUNCE_MS = 2000;

function recordToImageState(record: ImageRecord, blobUrl: string): ImageState {
  return {
    name: record.name,
    url: blobUrl,
    type: record.type,
    createdAt: record.createdAt,
    naturalAspectRatio: record.naturalAspectRatio,
    breakpoints: record.breakpoints ?? [{ objectPosition: DEFAULT_OBJECT_POSITION }],
  };
}

/**
 * @todo
 *
 * ### Basic functionality
 *
 * - Handle loading.
 * - Handle errors.
 * - Handle multiple tabs (current image id should be tied to current tab)
 * - Drag image to upload.
 * - Make shure focus is visible, specially in AspectRatioSlider.
 * - Make shure to use CSS variable for values used in calculations, specially in AspectRatioSlider.
 *    - Maybe this will improve performance of the ghost image?
 * - CodeSnippet with copy button.
 * - Melhorize™ UI.
 *
 * ### Landing page
 * - Shows all uploaded images with masonry grid.
 * - Explains the project.
 * - Maybe an explainer Loom?
 *
 * ### Advanced functionality
 *
 * - Handle multiple images (needs routing).
 * - Breakpoints with container queries.
 * - Undo/redo (needs state tracking).
 * - Maybe make a browser extension?.
 * - Maybe make a React component?.
 * - Maybe make a native custom element?.
 */
export default function Generator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImageIdRef = useRef<string | null>(null);
  const hasLoadedInitialImageRef = useRef(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<ImageState | null>(null);

  const { images, addImage, updateImage } = usePersistedImages();

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

  const aspectRatioList = useAspectRatioList(image?.naturalAspectRatio);

  const { createBlobUrl, revokeBlobUrl } = useBlobUrl();

  // Load last saved image on init (most recent by createdAt)
  useEffect(() => {
    if (images === undefined || images.length === 0 || hasLoadedInitialImageRef.current) {
      return;
    }
    hasLoadedInitialImageRef.current = true;
    const sorted = [...images].sort((a, b) => b.createdAt - a.createdAt);
    const lastRecord = sorted[0];
    if (!lastRecord) return;
    try {
      revokeBlobUrl();
      const blobUrl = createBlobUrl(lastRecord.file);
      setImage(recordToImageState(lastRecord, blobUrl));
      currentImageIdRef.current = lastRecord.id;
    } catch (error) {
      console.error("Error loading saved image:", error);
      currentImageIdRef.current = null;
    }
  }, [images, createBlobUrl, revokeBlobUrl]);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file?.type.startsWith("image/")) return;

      let blobUrl: string;
      let naturalAspectRatio: number;

      try {
        revokeBlobUrl();
        blobUrl = createBlobUrl(file);

        naturalAspectRatio = await new Promise<number>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
          img.onerror = () => reject(new Error("Failed to load image"));
          img.src = blobUrl;
        });
      } catch (error) {
        console.error("Error loading image:", error);
        revokeBlobUrl();
        setImage(null);
        return;
      }

      const imageState: ImageState = {
        name: file.name,
        url: blobUrl,
        type: file.type,
        createdAt: Date.now(),
        naturalAspectRatio,
        breakpoints: [{ objectPosition: DEFAULT_OBJECT_POSITION }],
      };
      setImage(imageState);

      try {
        const id = await addImage(imageState, file);
        currentImageIdRef.current = id;
      } catch (error) {
        console.error("Error saving image to database:", error);
        currentImageIdRef.current = null;
      }
    },
    [addImage, createBlobUrl, revokeBlobUrl],
  );

  const handleImageError = useCallback(() => {
    revokeBlobUrl();
    setImage(null);
    console.error("Error uploading image");
  }, [revokeBlobUrl]);

  const handleObjectPositionChange = useCallback((objectPosition: ObjectPositionString) => {
    setImage((prev) => (prev != null ? { ...prev, breakpoints: [{ objectPosition }] } : null));
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    return () => {
      revokeBlobUrl();
    };
  }, [revokeBlobUrl]);

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

  useDebouncedEffect(
    () => {
      const id = currentImageIdRef.current;
      if (id != null && currentObjectPosition != null) {
        updateImage(id, {
          breakpoints: [{ objectPosition: currentObjectPosition }],
        }).catch((error) => {
          console.error("Error saving position to database:", error);
        });
      }
    },
    { timeout: INTERACTION_DEBOUNCE_MS },
    [currentObjectPosition, updateImage],
  );

  return (
    <GeneratorGrid>
      <ImageUploader
        ref={fileInputRef}
        onFormSubmit={handleFormSubmit}
        onImageChange={handleFileChange}
        data-component="ImageUploader"
      />
      <ToggleBar data-component="ToggleBar">
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
      {image && currentObjectPosition && (
        <>
          {aspectRatio != null && image.naturalAspectRatio != null && (
            <FocusPointEditor
              ref={imageRef}
              imageUrl={image.url}
              aspectRatio={aspectRatio}
              initialAspectRatio={image.naturalAspectRatio}
              objectPosition={currentObjectPosition}
              showPointMarker={showPointMarker ?? false}
              showGhostImage={showGhostImage ?? false}
              onObjectPositionChange={handleObjectPositionChange}
              onImageError={handleImageError}
              data-component="FocusPointEditor"
            />
          )}
          <CodeSnippet
            src={image.name}
            objectPosition={currentObjectPosition}
            data-component="CodeSnippet"
            css={{
              opacity: showCodeSnippet ? 1 : 0,
              pointerEvents: showCodeSnippet ? "auto" : "none",
            }}
          />
          {aspectRatio != null && (
            <AspectRatioSlider
              aspectRatio={aspectRatio}
              aspectRatioList={aspectRatioList}
              onAspectRatioChange={setAspectRatio}
              data-component="AspectRatioSlider"
            />
          )}
        </>
      )}
    </GeneratorGrid>
  );
}
