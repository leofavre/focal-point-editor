import { AspectRatioControl } from "./AspectRatioControl/AspectRatioControl";
import type { AspectRatioControlProps } from "./AspectRatioControl/types";
import { AspectRatioRuler } from "./AspectRatioRuler/AspectRatioRuler";

export function AspectRatioSlider({
  aspectRatio,
  aspectRatioList,
  onAspectRatioChange,
}: AspectRatioControlProps) {
  return (
    <div className="aspect-ratio-slider">
      <AspectRatioControl
        aspectRatio={aspectRatio}
        aspectRatioList={aspectRatioList}
        onAspectRatioChange={onAspectRatioChange}
      />
      <AspectRatioRuler aspectRatioList={aspectRatioList} />
    </div>
  );
}
