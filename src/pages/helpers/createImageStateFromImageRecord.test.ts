import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { accept, reject } from "../../helpers/errorHandling";
import { createMockImageRecord } from "../../test-utils/mocks";
import { createImageStateFromImageRecord } from "./createImageStateFromImageRecord";
import { getNaturalAspectRatioFromImageSrc } from "./getNaturalAspectRatioFromImageSrc";

vi.mock("./getNaturalAspectRatioFromImageSrc");

describe("createImageStateFromImageRecord", () => {
  const mockCreateObjectURL = vi.fn();
  const mockRevokeObjectURL = vi.fn();

  beforeEach(() => {
    mockCreateObjectURL.mockReturnValue("blob:https://example.com/abc-123");
    mockRevokeObjectURL.mockImplementation(() => {});

    vi.spyOn(URL, "createObjectURL").mockImplementation(mockCreateObjectURL);
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(mockRevokeObjectURL);
    vi.mocked(getNaturalAspectRatioFromImageSrc).mockResolvedValue(accept(1.5));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns accepted ImageState with url and naturalAspectRatio when successful", async () => {
    const record = createMockImageRecord();

    const result = await createImageStateFromImageRecord(record);

    expect(result.accepted).toEqual({
      name: "test.png",
      url: "blob:https://example.com/abc-123",
      type: "image/png",
      createdAt: 1000,
      naturalAspectRatio: 1.5,
      breakpoints: [{ objectPosition: "50% 50%" }],
    });
  });

  it("creates blob URL from record file", async () => {
    const file = new Blob(["content"], { type: "image/jpeg" });
    const record = createMockImageRecord({ file });

    await createImageStateFromImageRecord(record);

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
  });

  it("gets natural aspect ratio from blob URL", async () => {
    const record = createMockImageRecord();

    await createImageStateFromImageRecord(record);

    expect(getNaturalAspectRatioFromImageSrc).toHaveBeenCalledTimes(1);
    expect(getNaturalAspectRatioFromImageSrc).toHaveBeenCalledWith(
      "blob:https://example.com/abc-123",
    );
  });

  it("preserves all record metadata in result", async () => {
    const record = createMockImageRecord({
      name: "custom-name.jpg",
      type: "image/jpeg",
      createdAt: 999,
      breakpoints: [{ objectPosition: "25% 75%" }],
    });

    const result = await createImageStateFromImageRecord(record);

    expect(result.accepted?.name).toBe("custom-name.jpg");
    expect(result.accepted?.type).toBe("image/jpeg");
    expect(result.accepted?.createdAt).toBe(999);
    expect(result.accepted?.breakpoints).toEqual([{ objectPosition: "25% 75%" }]);
  });

  it("revokes blob URL and returns rejected when getNaturalAspectRatioFromImageSrc fails", async () => {
    vi.mocked(getNaturalAspectRatioFromImageSrc).mockResolvedValue(
      reject({ reason: "ImageLoadFailed" }),
    );

    const result = await createImageStateFromImageRecord(createMockImageRecord());

    expect(result.rejected).toEqual({ reason: "ImageLoadFailed" });
    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:https://example.com/abc-123");
  });

  it("returns rejected with BlobCreateFailed when createObjectURL fails", async () => {
    mockCreateObjectURL.mockImplementation(() => {
      throw new Error("Quota exceeded");
    });

    const result = await createImageStateFromImageRecord(createMockImageRecord());

    expect(result.rejected).toEqual({ reason: "BlobCreateFailed" });
    expect(mockRevokeObjectURL).not.toHaveBeenCalled();
  });
});
