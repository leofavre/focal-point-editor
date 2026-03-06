import { describe, expect, it } from "vitest";
import { processImageFiles } from "./processImageFiles";

function createFile(name: string, type: string): File {
  return new File([], name, { type });
}

function createFileList(files: File[]): FileList {
  const list = { ...files, length: files.length } as unknown as FileList;
  list.item = (i: number) => files[i] ?? null;
  return list;
}

describe("processImageFiles", () => {
  it("returns empty array when files is null", () => {
    expect(processImageFiles(null)).toEqual([]);
  });

  it("returns empty array when files is empty", () => {
    const files = createFileList([]);
    expect(processImageFiles(files)).toEqual([]);
  });

  it("returns empty array when files contain no image types", () => {
    const file = createFile("doc.pdf", "application/pdf");
    const files = createFileList([file]);
    expect(processImageFiles(files)).toEqual([]);
  });

  it("returns image files when present", () => {
    const file = createFile("photo.png", "image/png");
    const files = createFileList([file]);

    const result = processImageFiles(files);

    expect(result).toHaveLength(1);
    expect(result[0].file).toBe(file);
    expect(result[0].imageDraft).toMatchObject({
      name: "photo.png",
      type: "image/png",
      breakpoints: [],
    });
    expect(result[0].imageDraft.createdAt).toBeTypeOf("number");
  });

  it("filters out non-image files and keeps image files", () => {
    const imageFile = createFile("photo.png", "image/png");
    const pdfFile = createFile("doc.pdf", "application/pdf");
    const jpegFile = createFile("photo.jpg", "image/jpeg");
    const files = createFileList([imageFile, pdfFile, jpegFile]);

    const result = processImageFiles(files);

    expect(result).toHaveLength(2);
    expect(result[0].file).toBe(imageFile);
    expect(result[1].file).toBe(jpegFile);
  });

  it("returns empty array when all files are non-image", () => {
    const pdfFile = createFile("doc.pdf", "application/pdf");
    const textFile = createFile("readme.txt", "text/plain");
    const files = createFileList([pdfFile, textFile]);

    expect(processImageFiles(files)).toEqual([]);
  });
});
