import { describe, expect, it } from "vitest";
import { getImageDimensionDelta } from "./getImageDimensionDelta";

function createMockImage({
  naturalWidth,
  naturalHeight,
  rectWidth,
  rectHeight,
}: {
  naturalWidth: number;
  naturalHeight: number;
  rectWidth: number;
  rectHeight: number;
}): HTMLImageElement {
  return {
    naturalWidth,
    naturalHeight,
    getBoundingClientRect: () => ({
      width: rectWidth,
      height: rectHeight,
      x: 0,
      y: 0,
      top: 0,
      right: rectWidth,
      bottom: rectHeight,
      left: 0,
      toJSON: () => ({}),
    }),
  } as unknown as HTMLImageElement;
}

describe("getImageDimensionDelta", () => {
  it("returns null when imgElement is null", () => {
    expect(getImageDimensionDelta(null)).toBeNull();
  });

  it("returns width/height deltas and changedDimension 'width' when image is constrained by width", () => {
    // 800×600 natural, 400×400 rect → contain scales to ~533×400; width delta > height delta
    const img = createMockImage({
      naturalWidth: 800,
      naturalHeight: 600,
      rectWidth: 400,
      rectHeight: 400,
    });
    const result = getImageDimensionDelta(img);

    expect(result).not.toBeNull();
    if (result == null) return;
    expect(result.changedDimension).toBe("width");
    expect(result.width.px).toBeGreaterThan(1);
    expect(result.height.px).toBe(0);
    expect(result.width.percent).toBeGreaterThan(0);
    expect(result.height.percent).toBe(0);
  });

  it("returns changedDimension 'height' when image is constrained by height", () => {
    // 400×400 natural, 800×600 rect → contain scales to 800×800; height delta > width delta
    const img = createMockImage({
      naturalWidth: 400,
      naturalHeight: 400,
      rectWidth: 800,
      rectHeight: 600,
    });
    const result = getImageDimensionDelta(img);

    expect(result).not.toBeNull();
    if (result == null) return;
    expect(result.changedDimension).toBe("height");
    expect(result.height.px).toBeGreaterThan(1);
    expect(result.width.px).toBe(0);
    expect(result.height.percent).toBeGreaterThan(0);
    expect(result.width.percent).toBe(0);
  });

  it("returns changedDimension undefined when both deltas are within threshold", () => {
    // Natural and rect same aspect and size → contain matches rect, deltas ~0
    const img = createMockImage({
      naturalWidth: 100,
      naturalHeight: 100,
      rectWidth: 100,
      rectHeight: 100,
    });
    const result = getImageDimensionDelta(img);

    expect(result).not.toBeNull();
    if (result == null) return;
    expect(result.changedDimension).toBeUndefined();
    expect(result.width.px).toBe(0);
    expect(result.height.px).toBe(0);
  });

  it("computes percent deltas relative to scaled dimensions", () => {
    // 800×600 → contain in 400×400 gives scaled 533.33×400; deltaWidth = 133.33
    // percent = (133.33 / 533.33) * 100 ≈ 25
    const img = createMockImage({
      naturalWidth: 800,
      naturalHeight: 600,
      rectWidth: 400,
      rectHeight: 400,
    });
    const result = getImageDimensionDelta(img);

    expect(result).not.toBeNull();
    if (result == null) return;
    expect(result.width.percent).toBeCloseTo(25, 0);
    expect(result.height.percent).toBe(0);
  });
});
