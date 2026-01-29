import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { usePersistedUIState } from "./hooks";

const mockGetByID = vi.fn();
const mockUpdate = vi.fn();

// Mock react-indexed-db-hook
vi.mock("react-indexed-db-hook", () => ({
  useIndexedDB: vi.fn(() => ({
    getByID: mockGetByID,
    update: mockUpdate,
  })),
}));

describe("usePersistedUIState", () => {
  it("returns undefined initially, then defaultValue when no persisted value exists", async () => {
    mockGetByID.mockResolvedValue(null);

    const { result } = renderHook(() =>
      usePersistedUIState({
        id: "testId",
        defaultValue: false,
      }),
    );

    // Initially undefined
    expect(result.current[0]).toBeUndefined();

    // After load, should be defaultValue
    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });

    expect(mockGetByID).toHaveBeenCalledWith("testId");
  });

  it("returns undefined initially, then persisted value when it exists", async () => {
    const persistedValue = true;
    mockGetByID.mockResolvedValue({ id: "testId", value: persistedValue });

    const { result } = renderHook(() =>
      usePersistedUIState({
        id: "testId",
        defaultValue: false,
      }),
    );

    // Initially undefined
    expect(result.current[0]).toBeUndefined();

    // After load, should be persisted value
    await waitFor(() => {
      expect(result.current[0]).toBe(persistedValue);
    });

    expect(mockGetByID).toHaveBeenCalledWith("testId");
  });

  it("falls back to defaultValue when IndexedDB getByID fails", async () => {
    mockGetByID.mockRejectedValue(new Error("IndexedDB error"));

    const { result } = renderHook(() =>
      usePersistedUIState({
        id: "testId",
        defaultValue: "default",
      }),
    );

    // Initially undefined
    expect(result.current[0]).toBeUndefined();

    // After error, should fall back to defaultValue
    await waitFor(() => {
      expect(result.current[0]).toBe("default");
    });
  });

  it("persists state changes to IndexedDB", async () => {
    mockGetByID.mockResolvedValue(null);
    mockUpdate.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      usePersistedUIState({
        id: "testId",
        defaultValue: 0,
      }),
    );

    // Wait for initial load
    await waitFor(() => {
      expect(result.current[0]).toBe(0);
    });

    // Update the value
    act(() => {
      result.current[1](5);
    });

    // Wait for state update and persistence
    await waitFor(() => {
      expect(result.current[0]).toBe(5);
      expect(mockUpdate).toHaveBeenCalledWith({ id: "testId", value: 5 });
    });
  });

  it("handles function updater pattern", async () => {
    mockGetByID.mockResolvedValue(null);
    mockUpdate.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      usePersistedUIState({
        id: "testId",
        defaultValue: 10,
      }),
    );

    // Wait for initial load
    await waitFor(() => {
      expect(result.current[0]).toBe(10);
    });

    // Update using function updater
    act(() => {
      result.current[1]((prev) => (prev ?? 0) + 5);
    });

    // Wait for state update and persistence
    await waitFor(() => {
      expect(result.current[0]).toBe(15);
      expect(mockUpdate).toHaveBeenCalledWith({ id: "testId", value: 15 });
    });
  });

  it("does not persist when value is set to null or undefined", async () => {
    mockGetByID.mockResolvedValue({ id: "testId", value: "initial" });
    mockUpdate.mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      usePersistedUIState({
        id: "testId",
        defaultValue: "default",
      }),
    );

    // Wait for initial load and initial persistence
    await waitFor(() => {
      expect(result.current[0]).toBe("initial");
    });

    // Wait for initial persistence to complete
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({ id: "testId", value: "initial" });
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
      result.current[1]("final");
    });

    // Wait for state to update
    await waitFor(() => {
      expect(result.current[0]).toBe("final");
    });

    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenLastCalledWith({ id: "testId", value: "final" });
  });

  it("handles different data types correctly", async () => {
    // Test with number
    mockGetByID.mockResolvedValue(null);
    const { result: numberResult } = renderHook(() =>
      usePersistedUIState({
        id: "numberId",
        defaultValue: 42,
      }),
    );

    await waitFor(() => {
      expect(numberResult.current[0]).toBe(42);
    });

    // Test with string
    mockGetByID.mockResolvedValue(null);
    const { result: stringResult } = renderHook(() =>
      usePersistedUIState({
        id: "stringId",
        defaultValue: "test",
      }),
    );

    await waitFor(() => {
      expect(stringResult.current[0]).toBe("test");
    });
  });

  it("handles multiple instances with different IDs independently", async () => {
    // Mock getByID to return different values based on the ID
    mockGetByID.mockImplementation((id: string) => {
      if (id === "id1") {
        return Promise.resolve({ id: "id1", value: "value1" });
      }
      if (id === "id2") {
        return Promise.resolve({ id: "id2", value: "value2" });
      }
      return Promise.resolve(null);
    });

    const { result: result1 } = renderHook(() =>
      usePersistedUIState({
        id: "id1",
        defaultValue: "default1",
      }),
    );

    const { result: result2 } = renderHook(() =>
      usePersistedUIState({
        id: "id2",
        defaultValue: "default2",
      }),
    );

    await waitFor(() => {
      expect(result1.current[0]).toBe("value1");
    });

    await waitFor(() => {
      expect(result2.current[0]).toBe("value2");
    });

    expect(mockGetByID).toHaveBeenCalledWith("id1");
    expect(mockGetByID).toHaveBeenCalledWith("id2");
  });

  it("treats id and defaultValue as stable so does not reload when they change", async () => {
    // Mock getByID to return different values based on the ID
    mockGetByID.mockImplementation((id: string) => {
      if (id === "id1") {
        return Promise.resolve({ id: "id1", value: "value1" });
      }
      if (id === "id2") {
        return Promise.resolve({ id: "id2", value: "value2" });
      }
      return Promise.resolve(null);
    });

    const { result, rerender } = renderHook(
      ({ id, defaultValue }) =>
        usePersistedUIState({
          id,
          defaultValue,
        }),
      {
        initialProps: { id: "id1", defaultValue: "default" },
      },
    );

    await waitFor(() => {
      expect(result.current[0]).toBe("value1");
    });

    // Change id
    rerender({ id: "id2", defaultValue: "default" });

    // Should not have reloaded
    expect(result.current[0]).toBe("value1");
    expect(mockGetByID).toHaveBeenCalledWith("id1");
    expect(mockGetByID).toHaveBeenCalledWith("id1");
  });
});
