import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import type { ImageState, ObjectPositionString } from "../../types";
import { GeneratorGrid, ToggleBar } from "./Generator.styled";
import { createKeyboardShortcutHandler } from "./helpers/createKeyboardShortcutHandler";
import { usePersistedImages } from "./hooks/usePersistedImages";
import { usePersistedUIRecord } from "./hooks/usePersistedUIRecord";

const DEFAULT_SHOW_POINT_MARKER = false;
const DEFAULT_SHOW_GHOST_IMAGE = false;
const DEFAULT_SHOW_CODE_SNIPPET = false;
const DEFAULT_ASPECT_RATIO = 1;
const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";

const INTERACTION_DEBOUNCE_MS = 500;
const IMAGE_LOAD_DEBOUNCE_MS = 50;

/**
 * @todo
 *
 * ### Basic functionality
 *
 * - Fix mess with blob URLs.
 * - Make AspectRatio appear even if there is no aspect ratio set yet.
 * - Handle loading.
 * - Handle errors.
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
 * - Breakpoints with container queries.
 * - Undo/redo (needs state tracking).
 * - Maybe make a browser extension?.
 * - Maybe make a React component?.
 * - Maybe make a native custom element?.
 */
export default function Generator() {
  /** @todo This ref is used for debug only and can be removed in the future. */
  const blobUrlRefs = useRef(new Set<string>());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { imageId } = useParams<{ imageId: string }>();
  const [image, setImage] = useState<ImageState | null>(null);
  const { images, addImage, updateImage } = usePersistedImages();

  /**
   * Safely set image state. Revokes the previous blob URL if the new URL is different.
   */
  const safeSetImage: typeof setImage = useEffectEvent((valueOrFn) => {
    setImage((prevValue) => {
      const nextValue = typeof valueOrFn === "function" ? valueOrFn(prevValue) : valueOrFn;

      if (prevValue != null && prevValue.url !== nextValue?.url) {
        URL.revokeObjectURL(prevValue.url);
        blobUrlRefs.current.delete(prevValue.url);
        console.log("removed blobUrl", blobUrlRefs.current);
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

  const navigate = useNavigate();

  const handleImageUpload = useCallback(
    async (imageState: ImageState | null, file: File | null) => {
      if (imageState == null || file == null) return;

      try {
        const nextImageId = await addImage(imageState, file);
        console.log("uploaded image with id", nextImageId);
        await navigate(`/${nextImageId}`);
        console.log("navigated to", `/${nextImageId}`);
      } catch (error) {
        console.error("Error saving image to database:", error);
      }
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

  useDebouncedEffect(
    () => {
      if (imageCount === 0) return;

      if (imageId == null) {
        safeSetImage(null);
        return;
      }

      const imageRecord = stableImageRecordGetter(imageId);

      if (imageRecord == null) return;

      try {
        const blobUrl = URL.createObjectURL(imageRecord.file);
        blobUrlRefs.current.add(blobUrl);
        console.log("added blobUrl", blobUrlRefs.current);

        safeSetImage({
          name: imageRecord.name,
          url: blobUrl,
          type: imageRecord.type,
          createdAt: imageRecord.createdAt,
          naturalAspectRatio: imageRecord.naturalAspectRatio,
          breakpoints: imageRecord.breakpoints,
        });

        console.log("loaded image from record", imageRecord);

        /** @todo early return if the user has refreshed the page. how to detect? */
        setAspectRatio(imageRecord.naturalAspectRatio ?? DEFAULT_ASPECT_RATIO);
      } catch (error) {
        safeSetImage(null);
        console.error("Error loading saved image:", error);
      }
    },
    { timeout: IMAGE_LOAD_DEBOUNCE_MS },
    [imageId, imageCount],
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
