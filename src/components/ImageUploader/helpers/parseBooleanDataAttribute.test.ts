import { describe, expect, it } from "vitest";
import { parseBooleanDataAttribute } from "./parseBooleanDataAttribute";

describe("parseBooleanDataAttribute", () => {
  it("returns empty string when value is true", () => {
    expect(parseBooleanDataAttribute(true)).toBe("");
  });

  it("returns undefined when value is false", () => {
    expect(parseBooleanDataAttribute(false)).toBeUndefined();
  });

  it("returns undefined when value is undefined", () => {
    expect(parseBooleanDataAttribute(undefined)).toBeUndefined();
  });
});
