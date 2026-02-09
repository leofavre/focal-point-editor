import type { Ref, SyntheticEvent } from "react";

export type ClippedImageProps = {
  ref?: Ref<HTMLImageElement>;
  imageUrl: string;
  objectPosition: string;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  onImageError?: (event: SyntheticEvent<HTMLImageElement>) => void;
};
