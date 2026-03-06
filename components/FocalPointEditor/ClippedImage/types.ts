import type { KeyboardEvent, Ref, SyntheticEvent } from "react";

export type ClippedImageProps = {
  ref?: Ref<HTMLImageElement>;
  focusableImageRef?: Ref<HTMLDivElement>;
  imageUrl: string;
  objectPosition: string;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
  onImageError?: (event: SyntheticEvent<HTMLImageElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
};
