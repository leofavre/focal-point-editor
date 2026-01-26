import type { ChangeEvent, FormEvent, SyntheticEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AspectRatioSlider } from "./components/AspectRatioSlider/AspectRatioSlider";
import { useAspectRatioList } from "./components/AspectRatioSlider/hooks";
import { CodeSnippet } from "./components/CodeSnippet/CodeSnippet";
import { DEFAULT_OBJECT_POSITION } from "./components/FocusPointEditor/constants";
import { FocusPointEditor } from "./components/FocusPointEditor/FocusPointEditor";
import { ImageUploader } from "./components/ImageUploader/ImageUploader";

/**
 * @todo
 *
 * ### Basic functionality
 *
 * - Persist image locally (needs IndexedDB)
 * - Allow user to upload another image
 * - Allow user to see and copy the generated code snippet
 * - Refine UI/UX
 *   - Slider ruler
 *   - Drag image to upload
 *   - Mark commonly used aspect ratios on slider
 *   - Mark original aspect ratio on slider
 *   - Implement arrow/tab keyboard interactions
 *
 * ### Advanced functionality
 *
 * - Handle multiple images (needs routing)
 * - Breakpoints with container queries
 * - Undo/redo (needs state tracking)
 * - Maybe make a browser extension?
 * - Maybe make a React component?
 */
export default function App() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageFileName, setImageFileName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>();
  const [naturalAspectRatio, setNaturalAspectRatio] = useState<number>();
  const [objectPosition, setObjectPosition] = useState(DEFAULT_OBJECT_POSITION);

  const aspectRatioList = useAspectRatioList(naturalAspectRatio);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file?.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImageFileName(file.name);
      setImageUrl(url);
    }
  }, []);

  const handleImageLoad = useCallback((event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const naturalAspectRatio = img.naturalWidth / img.naturalHeight;

    setNaturalAspectRatio(naturalAspectRatio);
    setAspectRatio(naturalAspectRatio);
  }, []);

  const handleImageError = useCallback(() => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
      setImageUrl(null);
    }
  }, [imageUrl]);

  const handleFormSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  }, []);

  return (
    <div className="app">
      {!imageUrl ? (
        <ImageUploader onFormSubmit={handleFormSubmit} onImageChange={handleFileChange} />
      ) : (
        <>
          <FocusPointEditor
            ref={imageRef}
            imageUrl={imageUrl}
            aspectRatio={aspectRatio}
            naturalAspectRatio={naturalAspectRatio}
            objectPosition={objectPosition}
            onObjectPositionChange={setObjectPosition}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
          />
          {aspectRatio && (
            <AspectRatioSlider
              aspectRatio={aspectRatio}
              aspectRatioList={aspectRatioList}
              onAspectRatioChange={setAspectRatio}
            />
          )}
          <CodeSnippet src={imageFileName} objectPosition={objectPosition} />
        </>
      )}
    </div>
  );
}
