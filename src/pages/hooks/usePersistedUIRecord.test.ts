import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { UIRecord, UIState } from "../../types";
import { usePersistedUIRecord } from "./usePersistedUIRecord";

const mockGetByID = vi.fn();
const mockUpdate = vi.fn();

// Mock react-indexed-db-hook
vi.mock("react-indexed-db-hook", () => ({
  useIndexedDB: vi.fn(() => ({
    getByID: mockGetByID,
    update: mockUpdate,
  })),
}));

describe("usePersistedUIRecord", () => {
  it("returns undefined initially, then value when no persisted value exists", async () => {
    mockGetByID.mockResolvedValue(null);

    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "showGhostImage",
        value: false,
      }),
    );

    // Initially undefined
    expect(result.current[0]).toBeUndefined();

    // After load, should be value
    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });

    expect(mockGetByID).toHaveBeenCalledWith("showGhostImage");
  });

  it("returns undefined initially, then persisted value when it exists", async () => {
    const persistedValue = true;
    mockGetByID.mockResolvedValue({ id: "showGhostImage", value: persistedValue });

    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "showGhostImage",
        value: false,
      }),
    );

    // Initially undefined
    expect(result.current[0]).toBeUndefined();

    // After load, should be persisted value
    await waitFor(() => {
      expect(result.current[0]).toBe(persistedValue);
    });

    expect(mockGetByID).toHaveBeenCalledWith("showGhostImage");
  });

  it("falls back to value when IndexedDB getByID fails", async () => {
    mockGetByID.mockRejectedValue(new Error("IndexedDB error"));

    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "showGhostImage",
        value: true,
      }),
    );

    // Initially undefined
    expect(result.current[0]).toBeUndefined();

    // After error, should fall back to value
    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });
  });

  it("persists state changes to IndexedDB", async () => {
    mockGetByID.mockResolvedValue(null);
    mockUpdate.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "aspectRatio",
        value: 1 / 2,
      }),
    );

    // Wait for initial load
    await waitFor(() => {
      expect(result.current[0]).toBe(1 / 2);
    });

    // Update the value
    act(() => {
      result.current[1](4 / 5);
    });

    // Wait for state update and persistence
    await waitFor(() => {
      expect(result.current[0]).toBe(4 / 5);
      expect(mockUpdate).toHaveBeenCalledWith({ id: "aspectRatio", value: 4 / 5 });
    });
  });

  it("handles function updater pattern", async () => {
    mockGetByID.mockResolvedValue(null);
    mockUpdate.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "aspectRatio",
        value: 1 / 2,
      }),
    );

    // Wait for initial load
    await waitFor(() => {
      expect(result.current[0]).toBe(1 / 2);
    });

    // Update using function updater
    act(() => {
      result.current[1]((prev) => (prev ?? 0) * 5);
    });

    // Wait for state update and persistence
    await waitFor(() => {
      expect(result.current[0]).toBe((1 / 2) * 5);
      expect(mockUpdate).toHaveBeenCalledWith({ id: "aspectRatio", value: (1 / 2) * 5 });
    });
  });

  it("does not persist when value is set to null or undefined", async () => {
    mockGetByID.mockResolvedValue({ id: "aspectRatio", value: 2 / 3 });
    mockUpdate.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "aspectRatio",
        value: 1 / 2,
      }),
    );

    // Wait for initial load and initial persistence
    await waitFor(() => {
      expect(result.current[0]).toBe(2 / 3);
    });

    // Wait for initial persistence to complete
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({ id: "aspectRatio", value: 2 / 3 });
    });

    // Set to undefined (should not persist)
    act(() => {
      result.current[1](undefined);
    });

    // Wait for state to update
    await waitFor(() => {
      expect(result.current[0]).toBeUndefined();
    });

    // Set to final (should persist)
    act(() => {
      result.current[1](4 / 5);
    });

    // Wait for state to update
    await waitFor(() => {
      expect(result.current[0]).toBe(4 / 5);
    });

    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenLastCalledWith({ id: "aspectRatio", value: 4 / 5 });
  });

  it("handles multiple instances with different IDs independently", async () => {
    // Mock getByID to return different values based on the ID
    mockGetByID.mockImplementation((id: string) => {
      if (id === "aspectRatio") {
        return Promise.resolve({ id: "aspectRatio", value: 3 / 4 });
      }
      if (id === "showGhostImage") {
        return Promise.resolve({ id: "showGhostImage", value: true });
      }
      return Promise.resolve(null);
    });

    const { result: result1 } = renderHook(() =>
      usePersistedUIRecord({
        id: "aspectRatio",
        value: 1 / 2,
      }),
    );

    const { result: result2 } = renderHook(() =>
      usePersistedUIRecord({
        id: "showGhostImage",
        value: false,
      }),
    );

    await waitFor(() => {
      expect(result1.current[0]).toBe(3 / 4);
    });

    await waitFor(() => {
      expect(result2.current[0]).toBe(true);
    });

    expect(mockGetByID).toHaveBeenCalledWith("aspectRatio");
    expect(mockGetByID).toHaveBeenCalledWith("showGhostImage");
  });

  it("treats id and value as stable so does not reload when they change", async () => {
    // Mock getByID to return different values based on the ID
    mockGetByID.mockImplementation((id: string) => {
      if (id === "aspectRatio") {
        return Promise.resolve({ id: "aspectRatio", value: 3 / 4 });
      }
      if (id === "showGhostImage") {
        return Promise.resolve({ id: "showGhostImage", value: true });
      }
      return Promise.resolve(null);
    });

    const { result, rerender } = renderHook(
      ({ id, value }: UIRecord<keyof UIState>) =>
        usePersistedUIRecord({
          id,
          value,
        }),
      {
        initialProps: { id: "aspectRatio", value: 1 / 2 },
      },
    );

    await waitFor(() => {
      expect(result.current[0]).toBe(3 / 4);
    });

    // Change id
    rerender({ id: "showGhostImage", value: false });

    // Should not have reloaded
    await waitFor(() => {
      expect(result.current[0]).toBe(3 / 4);
    });

    expect(mockGetByID).toHaveBeenCalledTimes(1);
    expect(mockGetByID).toHaveBeenLastCalledWith("aspectRatio");
  });
});
