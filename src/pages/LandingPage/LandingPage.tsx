import { useCallback } from "react";
import toast from "react-hot-toast";
import { useEditorContext } from "../../AppContext";
import { HowToUse } from "../../components/HowToUse/HowToUse";
import type { UploadErrorCode } from "../../components/ImageUploader/getUploadErrorMessage";
import { getUploadErrorMessage } from "../../components/ImageUploader/getUploadErrorMessage";
import { ImageUploaderButton } from "../../components/ImageUploader/ImageUploaderButton";
import type { Err } from "../../helpers/errorHandling";
import { LandingWrapper } from "../Landing/Landing.styled";

export function LandingPage() {
  const { handleImageUpload } = useEditorContext();

  const handleImageUploadError = useCallback((error: Err<UploadErrorCode>) => {
    toast.error(getUploadErrorMessage(error));
  }, []);

  return (
    <LandingWrapper data-component="Landing">
      <ImageUploaderButton
        size="medium"
        label="Choose image"
        onImageUpload={handleImageUpload}
        onImageUploadError={handleImageUploadError}
      />
      <HowToUse />
    </LandingWrapper>
  );
}
