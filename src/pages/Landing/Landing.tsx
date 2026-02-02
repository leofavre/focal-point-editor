import { ImageUploader } from "../../components/ImageUploader/ImageUploader";
import { usePersistedImages } from "../Editor/hooks/usePersistedImages";
import { LandingGrid, MosaicGrid, Title } from "./Landing.styled";
import { LandingImageCell } from "./LandingImageCell/LandingImageCell";

export default function Landing() {
  const { images } = usePersistedImages();

  return (
    <LandingGrid>
      <Title data-component="Title">Focus Point Manager</Title>
      <MosaicGrid data-component="MosaicGrid">
        <ImageUploader data-component="ImageUploader" />
        {(images ?? []).map((imageRecord) => (
          <LandingImageCell key={imageRecord.id} imageRecord={imageRecord} />
        ))}
      </MosaicGrid>
    </LandingGrid>
  );
}
