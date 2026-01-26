import styled from "@emotion/styled";
import type { ClippedImageProps } from "./types";

const ClippedImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  touch-action: none;
  user-select: none;
  z-index: 1;  

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    touch-action: none;
    user-select: none;
  }
`;

export function ClippedImage({
  ref,
  imageUrl,
  objectPosition,
  onImageLoad,
  onImageError,
  ...rest
}: ClippedImageProps) {
  return (
    <ClippedImageWrapper {...rest}>
      <img
        ref={ref}
        src={imageUrl}
        css={{ objectPosition }}
        onLoad={onImageLoad}
        onError={onImageError}
        /** @todo Maybe review this aria-label (and others) */
        aria-label="Image uploaded by the user"
      />
    </ClippedImageWrapper>
  );
}
