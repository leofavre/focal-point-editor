import type { AspectRatioRulerProps } from "./types";

export function AspectRatioRuler({ ref, aspectRatioList }: AspectRatioRulerProps) {
  const min = aspectRatioList.at(0)?.preciseValue ?? 1;
  const max = aspectRatioList.at(-1)?.preciseValue ?? 1;

  return (
    <ul ref={ref} className="aspect-ratio-ruler">
      {aspectRatioList.map(({ name, preciseValue }) => {
        const left = `${((preciseValue - min) / (max - min)) * 100}%`;

        return (
          <li key={name} className="item" style={{ left }}>
            <span className="label">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
