import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboard } from "./useCopyToClipboard";

vi.mock("../helpers/copyToClipboard", () => ({
  copyTextToClipboardWithToast: vi.fn(() => Promise.resolve()),
}));

const { copyTextToClipboardWithToast } = await import("../helpers/copyToClipboard");

describe("useCopyToClipboard", () => {
  afterEach(() => {
    vi.mocked(copyTextToClipboardWithToast).mockReset();
  });

  it("returns onCopy function", () => {
    const { result } = renderHook(() => useCopyToClipboard("text"));

    expect(result.current.onCopy).toBeTypeOf("function");
  });

  it("calls copyTextToClipboardWithToast with text when onCopy is invoked", async () => {
    const { result } = renderHook(() => useCopyToClipboard("snippet text"));

    await act(async () => {
      await result.current.onCopy();
    });

    expect(copyTextToClipboardWithToast).toHaveBeenCalledWith("snippet text");
  });

  it("uses latest text when it changes", async () => {
    const { result, rerender } = renderHook(
      ({ text }: { text: string }) => useCopyToClipboard(text),
      { initialProps: { text: "initial" } },
    );

    await act(async () => {
      await result.current.onCopy();
    });
    expect(copyTextToClipboardWithToast).toHaveBeenCalledWith("initial");

    rerender({ text: "updated" });
    await act(async () => {
      await result.current.onCopy();
    });
    expect(copyTextToClipboardWithToast).toHaveBeenLastCalledWith("updated");
  });
});
