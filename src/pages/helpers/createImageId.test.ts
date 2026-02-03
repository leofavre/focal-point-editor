import { describe, expect, it } from "vitest";
import { createImageId } from "./createImageId";

describe("createImageId", () => {
  it("returns slugified filename when no collision", () => {
    const usedIds = new Set<string>();
    expect(createImageId("My Photo.jpg", usedIds)).toBe("my-photo");
    expect(usedIds).toContain("my-photo");
  });

  it("appends -2 when base ID exists", () => {
    const usedIds = new Set(["my-photo"]);
    expect(createImageId("My Photo.jpg", usedIds)).toBe("my-photo-2");
    expect(usedIds).toContain("my-photo-2");
  });

  it("increments suffix for successive collisions", () => {
    const usedIds = new Set(["photo", "photo-2", "photo-3"]);
    expect(createImageId("photo.jpg", usedIds)).toBe("photo-4");
  });

  it("tracks IDs within batch so duplicates in same batch get unique IDs", () => {
    const usedIds = new Set<string>();
    expect(createImageId("image.png", usedIds)).toBe("image");
    expect(createImageId("image.png", usedIds)).toBe("image-2");
    expect(createImageId("image.png", usedIds)).toBe("image-3");
    expect(usedIds).toEqual(new Set(["image", "image-2", "image-3"]));
  });

  it("handles different files with same base name", () => {
    const usedIds = new Set<string>();
    expect(createImageId("photo.jpg", usedIds)).toBe("photo");
    expect(createImageId("photo.png", usedIds)).toBe("photo-2");
    expect(createImageId("photo.jpg", usedIds)).toBe("photo-3");
  });

  it("strips path separators", () => {
    const usedIds = new Set<string>();
    expect(createImageId("folder/photo.jpg", usedIds)).toBe("photo");
    expect(createImageId("path\\to\\image.png", usedIds)).toBe("image");
  });

  it("transliterates accented Latin characters", () => {
    const usedIds = new Set<string>();
    expect(createImageId("café.jpg", usedIds)).toBe("cafe");
    expect(createImageId("Déjà Vu!.png", usedIds)).toBe("deja-vu");
  });

  it("falls back to 'image' when filename would be empty", () => {
    expect(createImageId("....", new Set())).toBe("image");
    expect(createImageId("", new Set())).toBe("image");
  });
});
