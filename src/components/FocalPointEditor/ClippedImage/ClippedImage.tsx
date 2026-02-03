import { Wrapper } from "./ClippedImage.styled";
import type { ClippedImageProps } from "./types";

export function ClippedImage({
  ref,
  imageUrl,
  objectPosition,
  onImageLoad,
  onImageError,
  ...rest
}: ClippedImageProps) {
  return (
    <Wrapper {...rest}>
      <img
        ref={ref}
        src={imageUrl}
        css={{ objectPosition }}
        onLoad={onImageLoad}
        onError={onImageError}
        /** @todo Maybe review this aria-label (and others) */
        aria-label="Image uploaded by the user"
      />
    </Wrapper>
  );
}
