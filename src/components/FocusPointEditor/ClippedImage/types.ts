import type { RefObject, SyntheticEvent } from "react";

export type ClippedImageProps = {
  ref?: RefObject<HTMLImageElement | null>;
  imageUrl: string;
  objectPosition: string;
  onImageLoad: (event: SyntheticEvent<HTMLImageElement>) => void;
  onImageError: (event: SyntheticEvent<HTMLImageElement>) => void;
};
