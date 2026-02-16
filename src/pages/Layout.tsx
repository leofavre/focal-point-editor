import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { useEditorContext } from "../AppContext";
import { AspectRatioSlider } from "../components/AspectRatioSlider/AspectRatioSlider";
import { FullScreenDropZone } from "../components/ImageUploader/FullScreenDropZone";
import { ImageUploaderButton } from "../components/ImageUploader/ImageUploaderButton";
import { ToggleButton } from "../components/ToggleButton/ToggleButton";
import { ButtonText } from "../components/ToggleButton/ToggleButton.styled";
import { parseBooleanAttr } from "../helpers/parseBooleanAttr";
import { IconCode } from "../icons/IconCode";
import { IconMask } from "../icons/IconMask";
import { IconReference } from "../icons/IconReference";
import { LayoutGrid, LayoutMessage } from "./Layout.styled";

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
 *
 * ### Basic functionality
 *
 * - Handle errors with toaster.
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
export default function Layout() {
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
      <LayoutGrid data-has-bottom-bar={parseBooleanAttr(showBottomBar)}>
        <Suspense fallback={<LayoutMessage>Loading...</LayoutMessage>}>
          <Outlet />
        </Suspense>
        <ToggleButton
          type="button"
          data-component="FocalPointButton"
          toggleable
          toggled={showFocalPoint ?? false}
          onToggle={(toggled) => setShowFocalPoint(!toggled)}
        >
          <IconReference />
          <ButtonText>Focal point</ButtonText>
        </ToggleButton>
        <ToggleButton
          type="button"
          data-component="ImageOverflowButton"
          toggleable
          toggled={showImageOverflow ?? false}
          onToggle={(toggled) => setShowImageOverflow(!toggled)}
        >
          <IconMask />
          <ButtonText>Overflow</ButtonText>
        </ToggleButton>
        <AspectRatioSlider
          aspectRatio={aspectRatio}
          defaultAspectRatio={image?.naturalAspectRatio}
          onAspectRatioChange={setAspectRatio}
        />
        <ToggleButton
          type="button"
          data-component="CodeSnippetButton"
          toggleable
          toggled={showCodeSnippet ?? false}
          onToggle={(toggled) => setShowCodeSnippet(!toggled)}
        >
          <IconCode />
          <ButtonText>Code</ButtonText>
        </ToggleButton>
        <ImageUploaderButton
          ref={uploaderButtonRef}
          label="Upload"
          onImageUpload={handleImageUpload}
          onImageUploadError={noop}
        />
      </LayoutGrid>
    </>
  );
}
