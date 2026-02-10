import type { Ref } from "react";
import type { Simplify } from "type-fest";
import type { SingleImageUploaderProps } from "../../components/ImageUploader/types";

export type LandingProps = Simplify<
  {
    ref?: Ref<HTMLDivElement>;
    uploaderButtonRef?: Ref<HTMLButtonElement>;
  } & Pick<SingleImageUploaderProps, "onImageUpload" | "onImageUploadError">
>;
