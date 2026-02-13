/**
 * Tests for usePersistedUIRecord.
 * This suite uses sessionStorage (and in-memory when forceInMemoryStorage is true), not IndexedDB.
 * For tests that use IndexedDB, the fake IndexedDB is provided by vitest.setup.ts ("fake-indexeddb/auto").
 */

import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { UIRecord, UIState } from "../../types";
import { usePersistedUIRecord } from "./usePersistedUIRecord";

/** SessionStorage key prefix used by the "ui" table in sessionStorageService. */
const UI_TABLE_PREFIX = "fpe_session_ui_";

function keyFor(id: string): string {
  return `${UI_TABLE_PREFIX}${id}`;
}

/**
 * Seeds sessionStorage with a UI record so the hook will load it on mount.
 * Use to simulate "persisted value exists" without mocking services.
 */
function seedSessionStorage<K extends keyof UIState>(id: string, value: UIState[K]): void {
  window.sessionStorage.setItem(keyFor(id), JSON.stringify({ id, value }));
}

describe("usePersistedUIRecord", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it("returns undefined initially, then value when no persisted value exists", async () => {
    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "showImageOverflow",
        value: false,
      }),
    );

    expect(result.current[0]).toBeUndefined();

    await waitFor(() => {
      expect(result.current[0]).toBe(false);
    });
  });

  it("returns undefined initially, then persisted value when it exists", async () => {
    const persistedValue = true;
    seedSessionStorage("showImageOverflow", persistedValue);

    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "showImageOverflow",
        value: false,
      }),
    );

    expect(result.current[0]).toBeUndefined();

    await waitFor(() => {
      expect(result.current[0]).toBe(persistedValue);
    });
  });

  it("when forceInMemoryStorage is true, uses in-memory and shows default when no value stored", async () => {
    const { result } = renderHook(() =>
      usePersistedUIRecord(
        { id: "showImageOverflow", value: true },
        { forceInMemoryStorage: true },
      ),
    );

    expect(result.current[0]).toBeUndefined();

    await waitFor(() => {
      expect(result.current[0]).toBe(true);
    });
  });

  it("persists state changes to storage", async () => {
    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "aspectRatio",
        value: 1 / 2,
      }),
    );

    await waitFor(() => {
      expect(result.current[0]).toBe(1 / 2);
    });

    act(() => {
      result.current[1](4 / 5);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(4 / 5);
    });

    await waitFor(() => {
      const raw = window.sessionStorage.getItem(keyFor("aspectRatio")) ?? "";
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw).value).toBe(4 / 5);
    });
  });

  it("handles function updater pattern", async () => {
    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "aspectRatio",
        value: 1 / 2,
      }),
    );

    await waitFor(() => {
      expect(result.current[0]).toBe(1 / 2);
    });

    act(() => {
      result.current[1]((prev) => (prev ?? 0) * 5);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe((1 / 2) * 5);
    });

    await waitFor(() => {
      const raw = window.sessionStorage.getItem(keyFor("aspectRatio")) ?? "";
      expect(raw).not.toBeNull();
      expect(JSON.parse(raw).value).toBe((1 / 2) * 5);
    });
  });

  it("does not persist when value is set to null or undefined", async () => {
    seedSessionStorage("aspectRatio", 2 / 3);

    const { result } = renderHook(() =>
      usePersistedUIRecord({
        id: "aspectRatio",
        value: 1 / 2,
      }),
    );

    await waitFor(() => {
      expect(result.current[0]).toBe(2 / 3);
    });

    act(() => {
      result.current[1](undefined);
    });

    await waitFor(() => {
      expect(result.current[0]).toBeUndefined();
    });

    act(() => {
      result.current[1](4 / 5);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(4 / 5);
    });

    expect(window.sessionStorage.getItem(keyFor("aspectRatio"))).not.toBeNull();
    const raw = window.sessionStorage.getItem(keyFor("aspectRatio")) ?? "";
    expect(JSON.parse(raw).value).toBe(4 / 5);
  });

  it("handles multiple instances with different IDs independently", async () => {
    seedSessionStorage("aspectRatio", 3 / 4);
    seedSessionStorage("showImageOverflow", true);

    const { result: result1 } = renderHook(() =>
      usePersistedUIRecord({
        id: "aspectRatio",
        value: 1 / 2,
      }),
    );

    const { result: result2 } = renderHook(() =>
      usePersistedUIRecord({
        id: "showImageOverflow",
        value: false,
      }),
    );

    await waitFor(() => {
      expect(result1.current[0]).toBe(3 / 4);
    });

    await waitFor(() => {
      expect(result2.current[0]).toBe(true);
    });
  });

  it("treats id and value as stable so does not reload when they change", async () => {
    seedSessionStorage("aspectRatio", 3 / 4);
    seedSessionStorage("showImageOverflow", true);

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

    rerender({ id: "showImageOverflow", value: false });

    await waitFor(() => {
      expect(result.current[0]).toBe(3 / 4);
    });
  });
});
