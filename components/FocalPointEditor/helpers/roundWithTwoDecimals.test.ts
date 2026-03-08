import { describe, expect, it } from "vitest";
import { roundWithTwoDecimals } from "./roundWithTwoDecimals";

describe("roundWithTwoDecimals", () => {
  it("rounds to two decimal places", () => {
    expect(roundWithTwoDecimals(1.234)).toBe(1.23);
    expect(roundWithTwoDecimals(1.235)).toBe(1.24);
    expect(roundWithTwoDecimals(1.999)).toBe(2);
  });

  it("handles integers", () => {
    expect(roundWithTwoDecimals(5)).toBe(5);
  });

  it("avoids floating-point drift", () => {
    expect(roundWithTwoDecimals(0.1 + 0.2)).toBe(0.3);
  });
});
