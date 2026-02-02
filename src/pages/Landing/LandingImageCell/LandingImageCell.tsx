import { useEffect, useState } from "react";
import { CellImage, CellLink, CellWrapper } from "./LandingImageCell.styled";
import type { LandingImageCellProps } from "./types";

/**
 * Renders an image from an {@link ImageRecord} inside a 1:1 aspect-ratio cell.
 * Uses object-fit: cover so the image fills the square.
 */
export function LandingImageCell({ imageRecord }: LandingImageCellProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const blobUrl = URL.createObjectURL(imageRecord.file);
    setUrl(blobUrl);
    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [imageRecord.file]);

  if (url == null) return null;

  const objectPosition = imageRecord.breakpoints[0]?.objectPosition;

  return (
    <CellWrapper data-component="LandingImageCell">
      <CellLink to={`/${imageRecord.id}`}>
        <CellImage src={url} alt={imageRecord.name} $objectPosition={objectPosition} />
      </CellLink>
    </CellWrapper>
  );
}
