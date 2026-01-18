import clsx from "clsx";
import type { AspectRatioRulerProps } from "./types";

export function AspectRatioRuler({
  aspectRatioList,
  className,
  ...rest
}: AspectRatioRulerProps) {
  const preciseMinAspectRatio = aspectRatioList.at(0)?.preciseValue ?? 1;
  const preciseMaxAspectRatio = aspectRatioList.at(-1)?.preciseValue ?? 1;

  return (
    <ul
      className={clsx(
        "relative flex items-center text-xs text-gray-500 h-8",
        className,
      )}
      {...rest}
    >
      {aspectRatioList.map(({ name, preciseValue }) => (
        <li
          key={name}
          className="w-px flex flex-col items-center justify-center absolute"
          style={{
            left: `${((preciseValue - preciseMinAspectRatio) / (preciseMaxAspectRatio - preciseMinAspectRatio)) * 100}%`,
          }}
        >
          {name}
        </li>
      ))}
    </ul>
  );
}
