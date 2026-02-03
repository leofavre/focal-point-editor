import { AspectRatioControl } from "./AspectRatioControl/AspectRatioControl";
import type { AspectRatioControlProps } from "./AspectRatioControl/types";
import { AspectRatioRuler } from "./AspectRatioRuler/AspectRatioRuler";
import { Wrapper } from "./AspectRatioSlider.styled";

export function AspectRatioSlider({
  aspectRatio,
  aspectRatioList,
  onAspectRatioChange,
  ...rest
}: AspectRatioControlProps) {
  return (
    <Wrapper data-component="AspectRatioSlider" {...rest}>
      <AspectRatioControl
        aspectRatio={aspectRatio}
        aspectRatioList={aspectRatioList}
        onAspectRatioChange={onAspectRatioChange}
      />
      <AspectRatioRuler aspectRatioList={aspectRatioList} />
    </Wrapper>
  );
}
