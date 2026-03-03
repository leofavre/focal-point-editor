import { FocusableImage, Wrapper } from "./ClippedImage.styled";
import type { ClippedImageProps } from "./types";

export function ClippedImage({
  ref,
  focusableImageRef,
  imageUrl,
  objectPosition,
  onImageLoad,
  onImageError,
  onKeyDown,
  ...rest
}: ClippedImageProps) {
  return (
    <Wrapper {...rest}>
      <FocusableImage
        ref={focusableImageRef}
        tabIndex={0}
        role="img"
        aria-label="Image uploaded by the user"
        onPointerDown={(e) => e.currentTarget.focus()}
        onKeyDown={onKeyDown}
      >
        <img
          ref={ref}
          src={imageUrl}
          alt=""
          css={{ objectPosition }}
          onLoad={onImageLoad}
          onError={onImageError}
          aria-hidden
        />
      </FocusableImage>
    </Wrapper>
  );
}
