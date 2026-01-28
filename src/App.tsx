import type { ChangeEvent, FormEvent, SyntheticEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import useDebouncedEffect from "use-debounced-effect";
import { AspectRatioSlider } from "./components/AspectRatioSlider/AspectRatioSlider";
import { useAspectRatioList } from "./components/AspectRatioSlider/hooks";
import { CodeSnippet } from "./components/CodeSnippet/CodeSnippet";
import { DEFAULT_OBJECT_POSITION } from "./components/FocusPointEditor/constants";
import { FocusPointEditor } from "./components/FocusPointEditor/FocusPointEditor";
import { ImageUploader } from "./components/ImageUploader/ImageUploader";
import { ToggleButton } from "./components/ToggleButton/ToggleButton";
import { CodeSnippetToggleIcon } from "./icons/CodeSnippetToggleIcon";
import { GhostImageToggleIcon } from "./icons/GhostImageToggleIcon";
import { PointMarkerToggleIcon } from "./icons/PointMarkerToggleIcon";
import {
  deleteAllImages,
  getCurrentImage,
  getUIState,
  initDB,
  saveImageToDB,
  saveUIState,
  updateImageInDB,
  updateUIState,
} from "./services/database";
import type { StoredImage, StoredUI } from "./types";

/**
 * @todo
 *
 * ### Basic functionality
 *
 * - Document functions, hooks and components
 * - Drag image to upload
 * - Implement keyboard shortcuts to show or hide point marker, ghost image and code snippet
 * - Implement arrow/tab keyboard interactions in AspectRatioSlider
 * - Make shure focus is visible, specially in AspectRatioSlider
 * - Make shure to use CSS variable for values used in calculations, specially in AspectRatioSlider
 * - CodeSnippet with copy button.
 * - Melhorize™ UI
 *
 * ### Advanced functionality
 *
 * - Handle multiple images (needs routing)
 * - Breakpoints with container queries
 * - Undo/redo (needs state tracking)
 * - Maybe make a browser extension?
 * - Maybe make a React component?
 * - Maybe make a native custom element?
 */
export default function App() {
  const isInitializingRef = useRef(true);
  const [isDBInitialized, setIsDBInitialized] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const [imageFileName, setImageFileName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageId, setImageId] = useState<string | null>(null);
  const [objectPosition, setObjectPosition] = useState(DEFAULT_OBJECT_POSITION);
  const [naturalAspectRatio, setNaturalAspectRatio] = useState<number>();

  const [aspectRatio, setAspectRatio] = useState<number>();
  const [showPointMarker, setShowPointMarker] = useState(true);
  const [showGhostImage, setShowGhostImage] = useState(true);
  const [showCodeSnippet, setShowCodeSnippet] = useState(false);

  const aspectRatioList = useAspectRatioList(naturalAspectRatio);

  // Initialize database and load current image on mount
  useEffect(() => {
    let isMounted = true;

    async function initializeApp() {
      try {
        await initDB();
        if (!isMounted) return;

        setIsDBInitialized(true);
        const currentImage = await getCurrentImage();
        if (!isMounted) return;

        // Load UI state from database
        const uiState = await getUIState();
        if (!isMounted) return;

        let calculatedNaturalAspectRatio: number | undefined;

        if (currentImage) {
          setImageId(currentImage.id);
          setImageFileName(currentImage.name);
          setImageUrl(currentImage.data);

          // Ensure objectPosition is always set (handle old images without this field)
          const objectPosition = currentImage.objectPosition ?? DEFAULT_OBJECT_POSITION;
          setObjectPosition(objectPosition);

          // Calculate naturalAspectRatio from the image
          const img = new Image();
          img.src = currentImage.data;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
          });

          calculatedNaturalAspectRatio = img.naturalWidth / img.naturalHeight;
          setNaturalAspectRatio(calculatedNaturalAspectRatio);

          // If objectPosition was missing, update the database with default
          if (currentImage.objectPosition == null) {
            await updateImageInDB(currentImage.id, {
              objectPosition: DEFAULT_OBJECT_POSITION,
            }).catch((error) => {
              console.error("Error updating image with defaults:", error);
            });
          }
        }

        // Restore UI state from database or use defaults
        if (uiState) {
          setAspectRatio(uiState.aspectRatio);
          setShowPointMarker(uiState.showPointMarker);
          setShowGhostImage(uiState.showGhostImage);
          setShowCodeSnippet(uiState.showCodeSnippet);
        } else {
          // No UI state exists, create default one
          const defaultAspectRatio = calculatedNaturalAspectRatio ?? 1;

          const defaultUIState: StoredUI = {
            id: "current",
            aspectRatio: defaultAspectRatio,
            showPointMarker: true,
            showGhostImage: true,
            showCodeSnippet: false,
          };

          await saveUIState(defaultUIState).catch((error) => {
            console.error("Error saving default UI state:", error);
          });

          setAspectRatio(defaultAspectRatio);
        }

        // Mark initialization as complete
        isInitializingRef.current = false;
      } catch (error) {
        console.error("Error initializing database:", error);
        isInitializingRef.current = false;
      }
    }

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  // Convert file to base64
  const fileToBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file?.type.startsWith("image/")) return;

      if (!isDBInitialized) {
        console.error("Database not initialized");
        return;
      }

      try {
        // Convert file to base64
        const base64 = await fileToBase64(file);

        // Create image element to get natural dimensions
        const img = new Image();
        img.src = base64;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
        });

        const naturalAspectRatio = img.naturalWidth / img.naturalHeight;

        // Create StoredImage object
        const imageData: StoredImage = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
          name: file.name,
          data: base64,
          size: file.size,
          type: file.type,
          timestamp: Date.now(),
          objectPosition: DEFAULT_OBJECT_POSITION,
        };

        // Delete all existing images (keep only one image in database)
        await deleteAllImages();

        // Save new image to database
        await saveImageToDB(imageData);

        // Get current UI state to preserve showPointMarker, showGhostImage, showCodeSnippet
        const currentUIState = await getUIState();

        // Update UI state: reset aspectRatio to naturalAspectRatio, preserve other UI preferences
        const updatedUIState: StoredUI = {
          id: "current",
          aspectRatio: naturalAspectRatio,
          showPointMarker: currentUIState?.showPointMarker ?? true,
          showGhostImage: currentUIState?.showGhostImage ?? true,
          showCodeSnippet: currentUIState?.showCodeSnippet ?? false,
        };

        await saveUIState(updatedUIState);

        // Update React state
        setImageId(imageData.id);
        setImageFileName(imageData.name);
        setImageUrl(imageData.data);
        setNaturalAspectRatio(naturalAspectRatio);
        setObjectPosition(imageData.objectPosition);
        setAspectRatio(naturalAspectRatio);

        // Preserve UI preferences instead of resetting
        if (currentUIState) {
          setShowPointMarker(currentUIState.showPointMarker);
          setShowGhostImage(currentUIState.showGhostImage);
          setShowCodeSnippet(currentUIState.showCodeSnippet);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    [fileToBase64, isDBInitialized],
  );

  const handleImageLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      const naturalAspectRatio = img.naturalWidth / img.naturalHeight;

      setNaturalAspectRatio(naturalAspectRatio);
      // Only set aspectRatio if it's not already set (from database)
      if (aspectRatio === undefined) {
        setAspectRatio(naturalAspectRatio);
      }
    },
    [aspectRatio],
  );

  const handleImageError = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  }, [imageUrl]);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  // Debounced update for aspectRatio
  useDebouncedEffect(
    () => {
      if (!isDBInitialized || aspectRatio == null) {
        return;
      }

      updateUIState({ aspectRatio }).catch((error) => {
        console.error("Error updating aspectRatio in database:", error);
      });
    },
    1000,
    [aspectRatio, isDBInitialized],
  );

  // Debounced update for objectPosition
  useDebouncedEffect(
    () => {
      if (!isDBInitialized || !imageId) {
        return;
      }

      updateImageInDB(imageId, { objectPosition }).catch((error) => {
        console.error("Error updating objectPosition in database:", error);
      });
    },
    1000,
    [objectPosition, imageId, isDBInitialized],
  );

  // Persist showPointMarker changes
  useEffect(() => {
    if (!isDBInitialized || isInitializingRef.current) {
      return;
    }

    updateUIState({ showPointMarker }).catch((error) => {
      console.error("Error updating showPointMarker in database:", error);
    });
  }, [showPointMarker, isDBInitialized]);

  // Persist showGhostImage changes
  useEffect(() => {
    if (!isDBInitialized || isInitializingRef.current) {
      return;
    }

    updateUIState({ showGhostImage }).catch((error) => {
      console.error("Error updating showGhostImage in database:", error);
    });
  }, [showGhostImage, isDBInitialized]);

  // Persist showCodeSnippet changes
  useEffect(() => {
    if (!isDBInitialized || isInitializingRef.current) {
      return;
    }

    updateUIState({ showCodeSnippet }).catch((error) => {
      console.error("Error updating showCodeSnippet in database:", error);
    });
  }, [showCodeSnippet, isDBInitialized]);

  return (
    <>
      <ImageUploader
        onFormSubmit={handleFormSubmit}
        onImageChange={handleFileChange}
        css={{ gridRow: "1", gridColumn: "2", marginRight: "auto" }}
      />
      <div
        css={[
          /** @todo Move inline static CSS into App > Moo */
          { gridRow: "1", gridColumn: "2", marginLeft: "auto" },
          /** @todo Move inline static CSS into Moo */
          { display: "flex", gap: "0.25rem" },
        ]}
      >
        <ToggleButton
          toggled={showPointMarker}
          onToggle={() => setShowPointMarker((prev) => !prev)}
          titleOn="Hide pointer marker"
          titleOff="Show pointer marker"
          icon={<PointMarkerToggleIcon />}
        />
        <ToggleButton
          toggled={showGhostImage}
          onToggle={() => setShowGhostImage((prev) => !prev)}
          titleOn="Hide ghost image"
          titleOff="Show ghost image"
          icon={<GhostImageToggleIcon />}
        />
        <ToggleButton
          toggled={showCodeSnippet}
          onToggle={() => setShowCodeSnippet((prev) => !prev)}
          titleOn="Hide code snippet"
          titleOff="Show code snippet"
          icon={<CodeSnippetToggleIcon />}
        />
      </div>
      {imageUrl && (
        <>
          <FocusPointEditor
            ref={imageRef}
            imageUrl={imageUrl}
            aspectRatio={aspectRatio}
            naturalAspectRatio={naturalAspectRatio}
            objectPosition={objectPosition}
            showPointMarker={showPointMarker}
            showGhostImage={showGhostImage}
            onObjectPositionChange={setObjectPosition}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
            /** @todo Move inline static CSS into App > FocusPointEditor */
            css={{
              gridRow: "2",
              gridColumn: "2",
              zIndex: 0,
            }}
          />
          <CodeSnippet
            src={imageFileName}
            objectPosition={objectPosition}
            css={{
              /** @todo Move inline static CSS into App > CodeSnippet */
              gridRow: "2",
              gridColumn: "1 / 4",
              margin: "auto 0 auto auto",
              maxWidth: 650,
              zIndex: 2,
              /** @todo Keep this style here */
              opacity: showCodeSnippet ? 1 : 0,
              transition: "opacity 0.15s ease",
              pointerEvents: showCodeSnippet ? "auto" : "none",
            }}
          />
          <AspectRatioSlider
            aspectRatio={aspectRatio}
            aspectRatioList={aspectRatioList}
            onAspectRatioChange={setAspectRatio}
            /** @todo Move inline static CSS into App > AspectRatioSlider */
            css={{
              gridRow: "3",
              gridColumn: "2",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: 1200,
              zIndex: 1,
            }}
          />
        </>
      )}
    </>
  );
}
