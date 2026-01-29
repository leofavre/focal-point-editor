import { describe, expect, it, vi } from "vitest";
import { createKeyboardShortcutHandler } from "./createKeyboardShortcutHandler";

describe("createKeyboardShortcutHandler", () => {
  it("calls callback when matching key is pressed (lowercase)", () => {
    const callback = vi.fn();
    const handler = createKeyboardShortcutHandler({ u: callback });

    const preventDefault = vi.fn();
    const event = { key: "u", preventDefault } as unknown as KeyboardEvent;
    handler(event);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("calls callback when matching key is pressed (uppercase)", () => {
    const callback = vi.fn();
    const handler = createKeyboardShortcutHandler({ u: callback });

    const preventDefault = vi.fn();
    const event = { key: "U", preventDefault } as unknown as KeyboardEvent;
    handler(event);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });

  it("does not call callback when key does not match", () => {
    const callback = vi.fn();
    const handler = createKeyboardShortcutHandler({ u: callback });

    const preventDefault = vi.fn();
    const event = { key: "x", preventDefault } as unknown as KeyboardEvent;
    handler(event);

    expect(callback).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it("handles multiple keys mapping to the same callback", () => {
    const callback = vi.fn();
    const handler = createKeyboardShortcutHandler({
      c: callback,
      d: callback,
    });

    const preventDefault1 = vi.fn();
    const event1 = { key: "c", preventDefault: preventDefault1 } as unknown as KeyboardEvent;
    handler(event1);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(preventDefault1).toHaveBeenCalledTimes(1);

    const preventDefault2 = vi.fn();
    const event2 = { key: "D", preventDefault: preventDefault2 } as unknown as KeyboardEvent;
    handler(event2);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(preventDefault2).toHaveBeenCalledTimes(1);
  });

  it("handles multiple different callbacks", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const handler = createKeyboardShortcutHandler({
      a: callback1,
      b: callback2,
    });

    const preventDefault1 = vi.fn();
    const event1 = { key: "a", preventDefault: preventDefault1 } as unknown as KeyboardEvent;
    handler(event1);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).not.toHaveBeenCalled();
    expect(preventDefault1).toHaveBeenCalledTimes(1);

    const preventDefault2 = vi.fn();
    const event2 = { key: "B", preventDefault: preventDefault2 } as unknown as KeyboardEvent;
    handler(event2);
    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
    expect(preventDefault2).toHaveBeenCalledTimes(1);
  });

  it("is case-insensitive for key map entries", () => {
    const callback = vi.fn();
    const handler = createKeyboardShortcutHandler({ U: callback });

    const preventDefault = vi.fn();
    const event = { key: "u", preventDefault } as unknown as KeyboardEvent;
    handler(event);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
  });
});
