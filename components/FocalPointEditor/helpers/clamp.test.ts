import { describe, expect, it } from "vitest";
import { clamp } from "./clamp";

describe("clamp", () => {
  it("returns value when within min and max", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it("returns min when value is below min", () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(-100, 5, 10)).toBe(5);
  });

  it("returns max when value is above max", () => {
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(100, 0, 10)).toBe(10);
  });
});
