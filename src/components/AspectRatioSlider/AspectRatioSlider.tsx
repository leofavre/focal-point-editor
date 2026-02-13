import { AspectRatioControl } from "./AspectRatioControl/AspectRatioControl";
import { AspectRatioRuler } from "./AspectRatioRuler/AspectRatioRuler";
import { Wrapper } from "./AspectRatioSlider.styled";
import { useAspectRatioList } from "./hooks/useAspectRatioList";
import type { AspectRatioSliderProps } from "./types";

export function AspectRatioSlider({
  aspectRatio,
  defaultAspectRatio,
  onAspectRatioChange,
  ...rest
}: AspectRatioSliderProps) {
  const aspectRatioList = useAspectRatioList(defaultAspectRatio);

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
