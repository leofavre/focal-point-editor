import styled from "@emotion/styled";
import { AspectRatioControl } from "./AspectRatioControl/AspectRatioControl";
import type { AspectRatioControlProps } from "./AspectRatioControl/types";
import { AspectRatioRuler } from "./AspectRatioRuler/AspectRatioRuler";

const AspectRatioSliderWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

export function AspectRatioSlider({
  aspectRatio,
  aspectRatioList,
  onAspectRatioChange,
  ...rest
}: AspectRatioControlProps) {
  return (
    <AspectRatioSliderWrapper {...rest}>
      <AspectRatioControl
        aspectRatio={aspectRatio}
        aspectRatioList={aspectRatioList}
        onAspectRatioChange={onAspectRatioChange}
        /** @todo Move inline static CSS into AspectRatioSlider > AspectRatioRuler */
        css={{ position: "relative", zIndex: 1 }}
      />
      <AspectRatioRuler
        aspectRatioList={aspectRatioList}
        /** @todo Move inline static CSS into AspectRatioSlider > AspectRatioRuler */
        css={{
          position: "relative",
          marginLeft: "7.5px",
          marginRight: "8.5px",
          marginTop: "-0.75rem",
          zIndex: 0,
        }}
      />
    </AspectRatioSliderWrapper>
  );
}
