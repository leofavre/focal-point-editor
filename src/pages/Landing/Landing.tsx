import { useCallback } from "react";
import { ImageUploader } from "../../components/ImageUploader/ImageUploader";
import type { ImageDraftStateAndFile } from "../../types";
import { usePersistedImages } from "../Editor/hooks/usePersistedImages";
import { Description, LandingGrid, MosaicGrid, Title } from "./Landing.styled";
import { LandingImageCell } from "./LandingImageCell/LandingImageCell";

export default function Landing() {
  const { images, addImages } = usePersistedImages();

  const handleImagesUpload = useCallback(
    async (draftsAndFiles: ImageDraftStateAndFile[]) => {
      await addImages(draftsAndFiles);
    },
    [addImages],
  );

  return (
    <LandingGrid>
      <Title data-component="Title">Focus Point Manager</Title>
      <Description data-component="Description">
        Upload images and set a focus point for each. The editor lets you preview how the image
        crops at different aspect ratios and gives you the CSS <code>object-position</code> value so
        your important subject stays in frame.
      </Description>
      <MosaicGrid data-component="MosaicGrid">
        <ImageUploader data-component="ImageUploader" onImagesUpload={handleImagesUpload} />
        {(images ?? []).map((imageRecord) => (
          <LandingImageCell key={imageRecord.id} imageRecord={imageRecord} />
        ))}
      </MosaicGrid>
    </LandingGrid>
  );
}
