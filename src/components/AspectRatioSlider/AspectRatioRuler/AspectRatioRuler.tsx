import { Item, Label, List } from "./AspectRatioRuler.styled";
import type { AspectRatioRulerProps } from "./types";

export function AspectRatioRuler({ ref, aspectRatioList, ...rest }: AspectRatioRulerProps) {
  return (
    <List data-component="AspectRatioRuler" ref={ref} {...rest}>
      {aspectRatioList.map(({ name, position }) => {
        return (
          <Item key={name} data-name={name} css={{ left: `${position * 100}%` }}>
            <Label>{name}</Label>
          </Item>
        );
      })}
    </List>
  );
}
