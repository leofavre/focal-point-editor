import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { accept, reject } from "../../helpers/errorHandling";
import { createMockImageDraftState } from "../../test-utils/mocks";
import { createImageStateFromUrl } from "./createImageStateFromUrl";
import { getNaturalAspectRatioFromImageSrc } from "./getNaturalAspectRatioFromImageSrc";

vi.mock("./getNaturalAspectRatioFromImageSrc");

describe("createImageStateFromUrl", () => {
  beforeEach(() => {
    vi.mocked(getNaturalAspectRatioFromImageSrc).mockResolvedValue(accept(1.5));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns accepted ImageState with url and naturalAspectRatio when URL is valid", async () => {
    const draftAndUrl = {
      imageDraft: createMockImageDraftState(),
      url: "https://example.com/image.png",
    };

    const result = await createImageStateFromUrl(draftAndUrl);

    expect(result.accepted).toEqual({
      name: "test.png",
      url: "https://example.com/image.png",
      type: "image/png",
      createdAt: 1000,
      naturalAspectRatio: 1.5,
      breakpoints: [{ objectPosition: "50% 50%" }],
    });
    expect(getNaturalAspectRatioFromImageSrc).toHaveBeenCalledWith("https://example.com/image.png");
  });

  it("rejects with InvalidUrl when URL has invalid format", async () => {
    const draftAndUrl = {
      imageDraft: createMockImageDraftState(),
      url: "not-a-valid-url",
    };

    const result = await createImageStateFromUrl(draftAndUrl);

    expect(result.rejected).toEqual({ reason: "InvalidUrl" });
    expect(getNaturalAspectRatioFromImageSrc).not.toHaveBeenCalled();
  });

  it("rejects with InvalidUrl when URL protocol is not http or https", async () => {
    const draftAndUrl = {
      imageDraft: createMockImageDraftState(),
      url: "file:///local/image.png",
    };

    const result = await createImageStateFromUrl(draftAndUrl);

    expect(result.rejected).toEqual({ reason: "InvalidUrl" });
    expect(getNaturalAspectRatioFromImageSrc).not.toHaveBeenCalled();
  });

  it("rejects with ImageLoadFailed when getNaturalAspectRatioFromImageSrc fails", async () => {
    vi.mocked(getNaturalAspectRatioFromImageSrc).mockResolvedValue(
      reject({ reason: "ImageLoadFailed" }),
    );

    const draftAndUrl = {
      imageDraft: createMockImageDraftState(),
      url: "https://example.com/image.png",
    };

    const result = await createImageStateFromUrl(draftAndUrl);

    expect(result.rejected).toEqual({ reason: "ImageLoadFailed" });
  });
});
