import { Outlet } from "react-router-dom";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { FullScreenDropZone } from "../components/ImageUploader/FullScreenDropZone";
import { ImageUploaderButton } from "../components/ImageUploader/ImageUploaderButton";
import { ToggleButton } from "../components/ToggleButton/ToggleButton";
import { useEditorContext } from "../contexts/EditorContext";
import { parseBooleanAttr } from "../helpers/parseBooleanAttr";
import { IconCode } from "../icons/IconCode";
import { IconMask } from "../icons/IconMask";
import { IconReference } from "../icons/IconReference";
import { EditorGrid } from "./Editor.styled";

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
 * - Improve loading state.
 * - Improve Code snippet.
 * - Improve toasters.
 * - Mobile: remove glow from iOS when clicking on buttons.
 * - Mobile: always use &:active instead of &:hover for touch devices.
 *
 * ### Basic functionality
 *
 * - Make the app use the same routing for every persistence mode.
 * - Split Editor.tsx in two files and take advantage of BrowserRouter's routes '/' and '/:imageId'.
 * - Then next step will be code splitting.
 * - Handle errors with toaster.
 * - Remove all deprecated and dead code.
 *
 * ### DevOps
 *
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
  const {
    image,
    aspectRatio,
    setAspectRatio,
    showFocalPoint,
    setShowFocalPoint,
    showImageOverflow,
    setShowImageOverflow,
    showCodeSnippet,
    setShowCodeSnippet,
    showBottomBar,
    handleImageUpload,
    uploaderButtonRef,
  } = useEditorContext();

  return (
    <>
      <FullScreenDropZone onImageUpload={handleImageUpload} onImageUploadError={noop} />
      <EditorGrid data-has-bottom-bar={parseBooleanAttr(showBottomBar)}>
        <Outlet />
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
          defaultAspectRatio={image?.naturalAspectRatio}
          onAspectRatioChange={setAspectRatio}
        />
      </EditorGrid>
    </>
  );
}
