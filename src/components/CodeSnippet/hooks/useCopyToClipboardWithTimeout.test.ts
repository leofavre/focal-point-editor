import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCopyToClipboardWithTimeout } from "./useCopyToClipboardWithTimeout";

vi.mock("../helpers/copyToClipboard", () => ({
  copyToClipboard: vi.fn(),
}));

const { normalizeWhitespaceInQuotesMock } = vi.hoisted(() => ({
  normalizeWhitespaceInQuotesMock: vi.fn((t: string) => t),
}));

vi.mock("../helpers/normalizeWhitespaceInQuotes", () => ({
  normalizeWhitespaceInQuotes: (t: string) => normalizeWhitespaceInQuotesMock(t),
}));

const { copyToClipboard } = await import("../helpers/copyToClipboard");

describe("useCopyToClipboardWithTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.mocked(copyToClipboard).mockReset();
    normalizeWhitespaceInQuotesMock.mockImplementation((t: string) => t);
  });

  it("returns copied: false initially", () => {
    vi.mocked(copyToClipboard).mockResolvedValue(true);

    const { result } = renderHook(() => useCopyToClipboardWithTimeout("text"));

    expect(result.current.copied).toBe(false);
  });

  it("syncs copied state to copiedProp when options.copied is provided", () => {
    vi.mocked(copyToClipboard).mockResolvedValue(true);

    const { result, rerender } = renderHook(
      ({ copied }) => useCopyToClipboardWithTimeout("text", { copied }),
      { initialProps: { copied: false } },
    );

    expect(result.current.copied).toBe(false);

    rerender({ copied: true });
    expect(result.current.copied).toBe(true);

    rerender({ copied: false });
    expect(result.current.copied).toBe(false);
  });

  it("sets copied to true on successful copy and resets after COPY_RESET_MS", async () => {
    vi.mocked(copyToClipboard).mockResolvedValue(true);

    const { result } = renderHook(() => useCopyToClipboardWithTimeout("text"));

    await act(async () => {
      await result.current.onCopy();
    });

    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.copied).toBe(false);
  });

  it("calls onCopiedChange when copy succeeds and when reset timeout fires", async () => {
    vi.mocked(copyToClipboard).mockResolvedValue(true);
    const onCopiedChange = vi.fn();

    const { result } = renderHook(() => useCopyToClipboardWithTimeout("text", { onCopiedChange }));

    await act(async () => {
      await result.current.onCopy();
    });

    expect(onCopiedChange).toHaveBeenCalledTimes(1);
    expect(onCopiedChange).toHaveBeenLastCalledWith(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onCopiedChange).toHaveBeenCalledTimes(2);
    expect(onCopiedChange).toHaveBeenLastCalledWith(false);
  });

  it("keeps copied false and calls onCopiedChange(false) when copy fails", async () => {
    vi.mocked(copyToClipboard).mockResolvedValue(false);
    const onCopiedChange = vi.fn();

    const { result } = renderHook(() => useCopyToClipboardWithTimeout("text", { onCopiedChange }));

    await act(async () => {
      await result.current.onCopy();
    });

    expect(result.current.copied).toBe(false);
    expect(onCopiedChange).toHaveBeenCalledTimes(1);
    expect(onCopiedChange).toHaveBeenCalledWith(false);
  });

  it("clears previous timeout when copying again before reset", async () => {
    vi.mocked(copyToClipboard).mockResolvedValue(true);

    const { result } = renderHook(() => useCopyToClipboardWithTimeout("text"));

    await act(async () => {
      await result.current.onCopy();
    });
    expect(result.current.copied).toBe(true);

    await act(async () => {
      await result.current.onCopy();
    });
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.copied).toBe(false);
  });

  it("passes normalized text to copyToClipboard", async () => {
    normalizeWhitespaceInQuotesMock.mockImplementation((t) => `normalized:${t}`);
    vi.mocked(copyToClipboard).mockResolvedValue(true);

    const { result } = renderHook(() => useCopyToClipboardWithTimeout("  raw  text  "));

    await act(async () => {
      await result.current.onCopy();
    });

    expect(copyToClipboard).toHaveBeenCalledWith("normalized:  raw  text  ");
  });
});
