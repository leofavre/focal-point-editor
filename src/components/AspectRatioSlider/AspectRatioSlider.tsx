import { AspectRatioControl } from "./AspectRatioControl/AspectRatioControl";
import { AspectRatioRuler } from "./AspectRatioRuler/AspectRatioRuler";
import { Container, Wrapper } from "./AspectRatioSlider.styled";
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
    <Container data-component="AspectRatioSlider" {...rest}>
      <Wrapper>
        <AspectRatioControl
          aspectRatio={aspectRatio}
          aspectRatioList={aspectRatioList}
          onAspectRatioChange={onAspectRatioChange}
        />
        <AspectRatioRuler aspectRatioList={aspectRatioList} />
      </Wrapper>
    </Container>
  );
}
