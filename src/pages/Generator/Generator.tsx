import type { ChangeEvent, FormEvent } from "react";
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
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
import { usePersistedUIState } from "./hooks/usePersistedUIState";
import type { ImageState } from "./types";

const DEFAULT_SHOW_POINT_MARKER = false;
const DEFAULT_SHOW_GHOST_IMAGE = false;
const DEFAULT_SHOW_CODE_SNIPPET = false;
const DEFAULT_ASPECT_RATIO = 1;
const DEFAULT_OBJECT_POSITION: ObjectPositionString = "50% 50%";

/**
 * @todo
 *
 * ### Basic functionality
 *
 * - Handle loading.
 * - Handle errors.
 * - Persist images and their states in IndexedDB.
 * - Reset aspectRatio when a new image is uploaded.
 * - Document functions, hooks and components.
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
 * - Plan state (and reducers?)
 * - Handle multiple images (needs routing).
 * - Breakpoints with container queries.
 * - Undo/redo (needs state tracking).
 * - Maybe make a browser extension?.
 * - Maybe make a React component?.
 * - Maybe make a native custom element?.
 */
export default function Generator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const [image, setImage] = useState<ImageState | null>(null);

  const [aspectRatio, setAspectRatio] = usePersistedUIState({
    id: "aspectRatio",
    defaultValue: DEFAULT_ASPECT_RATIO,
    debounceTimeout: 1000,
  });

  const [showPointMarker, setShowPointMarker] = usePersistedUIState({
    id: "showPointMarker",
    defaultValue: DEFAULT_SHOW_POINT_MARKER,
  });

  const [showGhostImage, setShowGhostImage] = usePersistedUIState({
    id: "showGhostImage",
    defaultValue: DEFAULT_SHOW_GHOST_IMAGE,
  });

  const [showCodeSnippet, setShowCodeSnippet] = usePersistedUIState({
    id: "showCodeSnippet",
    defaultValue: DEFAULT_SHOW_CODE_SNIPPET,
  });

  const aspectRatioList = useAspectRatioList(image?.naturalAspectRatio);

  const revokeCurrentBlobUrl = useEffectEvent(() => {
    if (blobUrlRef.current == null) return;
    URL.revokeObjectURL(blobUrlRef.current);
  });

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file?.type.startsWith("image/")) return;

    try {
      revokeCurrentBlobUrl();

      const blobUrl = URL.createObjectURL(file);
      blobUrlRef.current = blobUrl;

      // Load image to get natural dimensions
      const naturalAspectRatio = await new Promise<number>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = blobUrl;
      });

      setImage({
        name: file.name,
        url: blobUrl,
        type: file.type,
        createdAt: Date.now(),
        naturalAspectRatio,
        breakpoints: [{ objectPosition: DEFAULT_OBJECT_POSITION }],
      });
    } catch (error) {
      revokeCurrentBlobUrl();
      blobUrlRef.current = null;

      setImage(null);

      console.error("Error uploading image:", error);
    }
  }, []);

  const handleImageError = useCallback(() => {
    revokeCurrentBlobUrl();
    blobUrlRef.current = null;

    setImage(null);

    console.error("Error uploading image");
  }, []);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
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
              onObjectPositionChange={(objectPosition) => {
                setImage((prev) =>
                  prev != null ? { ...prev, breakpoints: [{ objectPosition }] } : null,
                );
              }}
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
