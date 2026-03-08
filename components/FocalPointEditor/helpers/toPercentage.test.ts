import { describe, expect, it } from "vitest";
import { toPercentage } from "./toPercentage";

describe("toPercentage", () => {
  it("computes (a / b) * 100 correctly", () => {
    expect(toPercentage(1, 4)).toBe(25);
    expect(toPercentage(50, 200)).toBe(25);
    expect(toPercentage(0, 100)).toBe(0);
    expect(toPercentage(100, 100)).toBe(100);
    expect(toPercentage(4, 7)).toBeCloseTo(57.14, 2);
  });

  it("returns 0 when b is 0", () => {
    expect(toPercentage(1, 0)).toBe(0);
    expect(toPercentage(50, 0)).toBe(0);
  });

  it("returns 0 when b is negative", () => {
    expect(toPercentage(1, -1)).toBe(0);
  });
});
