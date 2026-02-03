import {
  AspectRatioRulerItem,
  AspectRatioRulerLabel,
  AspectRatioRulerList,
} from "./AspectRatioRuler.styled";
import type { AspectRatioRulerProps } from "./types";

export function AspectRatioRuler({ ref, aspectRatioList, ...rest }: AspectRatioRulerProps) {
  return (
    <AspectRatioRulerList data-component="AspectRatioRuler" ref={ref} {...rest}>
      {aspectRatioList.map(({ name, position }) => {
        return (
          <AspectRatioRulerItem key={name} css={{ left: `${position * 100}%` }}>
            <AspectRatioRulerLabel>{name}</AspectRatioRulerLabel>
          </AspectRatioRulerItem>
        );
      })}
    </AspectRatioRulerList>
  );
}
