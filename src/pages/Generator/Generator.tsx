import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useParams } from "react-router-dom";
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
import type { ImageRecord, ImageState, ObjectPositionString } from "../../types";
import { GeneratorGrid, ToggleBar } from "./Generator.styled";
import { createKeyboardShortcutHandler } from "./helpers/createKeyboardShortcutHandler";
import { usePersistedImages } from "./hooks/usePersistedImages";
import { usePersistedUIRecord } from "./hooks/usePersistedUIRecord";

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
    breakpoints: record.breakpoints,
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

  const imageIdRef = useRef<string | null>(null);
  const { imageId } = useParams<{ imageId: string }>();
  const [image, setImage] = useState<ImageState | null>(null);
  const { images, addImage, updateImage } = usePersistedImages();

  /**
   * Safe set image state. Revokes the previous blob URL if the new URL is different.
   */
  const safeSetImage: typeof setImage = useEffectEvent((valueOrFn) => {
    setImage((prevValue) => {
      const nextValue = typeof valueOrFn === "function" ? valueOrFn(prevValue) : valueOrFn;

      if (prevValue != null && prevValue.url !== nextValue?.url) {
        URL.revokeObjectURL(prevValue.url);
      }

      return nextValue;
    });
  });

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

  const handleImageUpload = useCallback(
    async (imageState: ImageState | null, file: File | null) => {
      /** @todo Instead of setting the image state after uploading the image, we should go to the corresponding route with the new image id. */
      safeSetImage(imageState);

      if (imageState == null || file == null) return;

      try {
        const id = await addImage(imageState, file);
        imageIdRef.current = id;
      } catch (error) {
        console.error("Error saving image to database:", error);
        imageIdRef.current = null;
      }
    },
    [addImage],
  );

  const handleImageError = useCallback(() => {
    console.error("Error uploading image");
    safeSetImage(null);
  }, []);

  const handleObjectPositionChange = useCallback((objectPosition: ObjectPositionString) => {
    safeSetImage((prev) => (prev != null ? { ...prev, breakpoints: [{ objectPosition }] } : null));
  }, []);

  // Load last saved image on init (most recent by createdAt)
  useEffect(() => {
    if (images === undefined || images.length === 0 || imageId == null) return;

    const imageRecord = images.find((image) => image.id === imageId);

    if (imageRecord == null) return;

    try {
      const blobUrl = URL.createObjectURL(imageRecord.file);
      safeSetImage(recordToImageState(imageRecord, blobUrl));
      imageIdRef.current = imageRecord.id;
    } catch (error) {
      console.error("Error loading saved image:", error);
      safeSetImage(null);
      imageIdRef.current = null;
    }
  }, [images, imageId]);

  useEffect(() => {
    return () => {
      safeSetImage(null);
    };
  }, []);

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
      const id = imageIdRef.current;

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
        onImageUpload={handleImageUpload}
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
      {image && (
        <>
          {aspectRatio != null && image.naturalAspectRatio != null && (
            <FocusPointEditor
              imageUrl={image.url}
              aspectRatio={aspectRatio}
              initialAspectRatio={image.naturalAspectRatio}
              objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
              showPointMarker={showPointMarker ?? false}
              showGhostImage={showGhostImage ?? false}
              onObjectPositionChange={handleObjectPositionChange}
              onImageError={handleImageError}
              data-component="FocusPointEditor"
            />
          )}
          <CodeSnippet
            src={image.name}
            objectPosition={currentObjectPosition ?? DEFAULT_OBJECT_POSITION}
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
