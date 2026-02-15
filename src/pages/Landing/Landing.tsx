import { useEditorContext } from "../../AppContext";
import { HowToUse } from "../../components/HowToUse/HowToUse";
import { ImageUploaderButton } from "../../components/ImageUploader/ImageUploaderButton";
import { LandingWrapper } from "./Landing.styled";
import type { LandingProps } from "./types";

const noop = () => {};

/**
 * Landing page for the index route (/). Uses shared app context for upload.
 * The layout (toolbar, drop zone, etc.) is provided by the parent route.
 */
export function Landing({ ref, ...rest }: LandingProps) {
  const { handleImageUpload } = useEditorContext();

  return (
    <LandingWrapper ref={ref} data-component="Landing" {...rest}>
      <ImageUploaderButton
        size="medium"
        label="Upload image"
        onImageUpload={handleImageUpload}
        onImageUploadError={noop}
      />
      <HowToUse />
    </LandingWrapper>
  );
}
