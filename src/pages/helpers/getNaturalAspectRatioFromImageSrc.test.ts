import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getNaturalAspectRatioFromImageSrc } from "./getNaturalAspectRatioFromImageSrc";

describe("getNaturalAspectRatioFromImageSrc", () => {
  let mockBehavior: "load" | "error";
  let mockDimensions: { naturalWidth: number; naturalHeight: number };
  let MockImage: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockBehavior = "load";
    mockDimensions = { naturalWidth: 300, naturalHeight: 200 };

    MockImage = vi.fn().mockImplementation(function (this: {
      naturalWidth: number;
      naturalHeight: number;
      _src: string;
      onload: (() => void) | null;
      onerror: (() => void) | null;
    }) {
      this.naturalWidth = 0;
      this.naturalHeight = 0;
      this._src = "";
      this.onload = null;
      this.onerror = null;

      Object.defineProperty(this, "src", {
        set(value: string) {
          this._src = value;
          queueMicrotask(() => {
            if (mockBehavior === "load") {
              this.naturalWidth = mockDimensions.naturalWidth;
              this.naturalHeight = mockDimensions.naturalHeight;
              this.onload?.();
            } else {
              this.onerror?.();
            }
          });
        },
        get() {
          return this._src;
        },
        configurable: true,
      });
    });

    vi.stubGlobal("Image", MockImage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolves with accepted aspect ratio when image loads successfully", async () => {
    const result = await getNaturalAspectRatioFromImageSrc("blob:https://example.com/abc");

    expect(result.accepted).toBe(1.5); // 300 / 200
  });

  it("uses naturalWidth and naturalHeight from loaded image", async () => {
    mockDimensions = { naturalWidth: 800, naturalHeight: 600 };

    const result = await getNaturalAspectRatioFromImageSrc("blob:test");

    expect(result.accepted).toBeCloseTo(800 / 600, 10); // ~1.333...
  });

  it("handles square images", async () => {
    mockDimensions = { naturalWidth: 500, naturalHeight: 500 };

    const result = await getNaturalAspectRatioFromImageSrc("blob:square");

    expect(result.accepted).toBe(1);
  });

  it("handles portrait orientation", async () => {
    mockDimensions = { naturalWidth: 400, naturalHeight: 600 };

    const result = await getNaturalAspectRatioFromImageSrc("blob:portrait");

    expect(result.accepted).toBeCloseTo(2 / 3, 10); // ~0.667
  });

  it("returns rejected with ImageLoadFailed when image fails to load", async () => {
    mockBehavior = "error";

    const result = await getNaturalAspectRatioFromImageSrc("blob:invalid");

    expect(result.rejected).toEqual(expect.objectContaining({ reason: "ImageLoadFailed" }));
  });

  it("sets img.src to the provided url", async () => {
    mockDimensions = { naturalWidth: 100, naturalHeight: 100 };
    const url = "blob:https://example.com/xyz-123";

    const result = await getNaturalAspectRatioFromImageSrc(url);

    expect(result.accepted).toBe(1);
    const imgInstance = MockImage.mock.results[0].value;
    expect(imgInstance.src).toBe(url);
  });
});
