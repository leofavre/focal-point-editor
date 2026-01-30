import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useBlobUrl } from "./useBlobUrl";

describe("useBlobUrl", () => {
  const mockCreateObjectURL = vi.fn();
  const mockRevokeObjectURL = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("URL", {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns createBlobUrl and revokeBlobUrl", () => {
    const { result } = renderHook(() => useBlobUrl());

    expect(result.current).toHaveProperty("createBlobUrl");
    expect(result.current).toHaveProperty("revokeBlobUrl");
    expect(typeof result.current.createBlobUrl).toBe("function");
    expect(typeof result.current.revokeBlobUrl).toBe("function");
  });

  it("createBlobUrl creates object URL and returns it", () => {
    const blob = new Blob(["x"], { type: "image/png" });
    mockCreateObjectURL.mockReturnValue("blob:http://localhost/abc");

    const { result } = renderHook(() => useBlobUrl());

    let url: string | undefined;
    act(() => {
      url = result.current.createBlobUrl(blob);
    });

    expect(url).toBe("blob:http://localhost/abc");
    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
  });

  it("revokeBlobUrl revokes the current URL", () => {
    const blob = new Blob(["x"], { type: "image/png" });
    mockCreateObjectURL.mockReturnValue("blob:http://localhost/xyz");

    const { result } = renderHook(() => useBlobUrl());

    act(() => {
      result.current.createBlobUrl(blob);
    });

    act(() => {
      result.current.revokeBlobUrl();
    });

    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:http://localhost/xyz");
  });

  it("revokeBlobUrl is a no-op when no URL was created", () => {
    const { result } = renderHook(() => useBlobUrl());

    act(() => {
      result.current.revokeBlobUrl();
    });

    expect(mockRevokeObjectURL).not.toHaveBeenCalled();
  });

  it("createBlobUrl overwrites previous URL; revokeBlobUrl revokes the latest", () => {
    const blob1 = new Blob(["a"], { type: "image/png" });
    const blob2 = new Blob(["b"], { type: "image/png" });
    mockCreateObjectURL
      .mockReturnValueOnce("blob:http://localhost/first")
      .mockReturnValueOnce("blob:http://localhost/second");

    const { result } = renderHook(() => useBlobUrl());

    act(() => {
      result.current.createBlobUrl(blob1);
    });
    act(() => {
      result.current.createBlobUrl(blob2);
    });
    act(() => {
      result.current.revokeBlobUrl();
    });

    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith("blob:http://localhost/second");
  });

  it("revokeBlobUrl after revoke is a no-op", () => {
    const blob = new Blob(["x"], { type: "image/png" });
    mockCreateObjectURL.mockReturnValue("blob:http://localhost/abc");

    const { result } = renderHook(() => useBlobUrl());

    act(() => {
      result.current.createBlobUrl(blob);
    });
    act(() => {
      result.current.revokeBlobUrl();
    });
    act(() => {
      result.current.revokeBlobUrl();
    });

    expect(mockRevokeObjectURL).toHaveBeenCalledTimes(1);
  });
});
