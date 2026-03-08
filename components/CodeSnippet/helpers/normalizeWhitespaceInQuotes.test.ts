import { describe, expect, it } from "vitest";
import { normalizeWhitespaceInQuotes } from "./normalizeWhitespaceInQuotes";

describe("normalizeWhitespaceInQuotes", () => {
  it("returns empty string unchanged", () => {
    expect(normalizeWhitespaceInQuotes("")).toBe("");
  });

  it("returns string with no quotes unchanged", () => {
    const text = "hello  world\n\t  foo";
    expect(normalizeWhitespaceInQuotes(text)).toBe(text);
  });

  it("collapses repeated whitespace inside double-quoted strings", () => {
    expect(normalizeWhitespaceInQuotes('"a   b"')).toBe('"a b"');
    expect(normalizeWhitespaceInQuotes('"a\n\nb"')).toBe('"a b"');
    expect(normalizeWhitespaceInQuotes('"a \t \n b"')).toBe('"a b"');
  });

  it("collapses repeated whitespace inside single-quoted strings", () => {
    expect(normalizeWhitespaceInQuotes("'a   b'")).toBe("'a b'");
    expect(normalizeWhitespaceInQuotes("'a\n\nb'")).toBe("'a b'");
  });

  it("trims leading and trailing whitespace inside quotes", () => {
    expect(normalizeWhitespaceInQuotes('"  foo  "')).toBe('"foo"');
    expect(normalizeWhitespaceInQuotes("'  bar  '")).toBe("'bar'");
  });

  it("leaves content outside quotes unchanged", () => {
    const before = 'foo   "  a  b  "   bar';
    const after = 'foo   "a b"   bar';
    expect(normalizeWhitespaceInQuotes(before)).toBe(after);
  });

  it("handles multiple quoted strings", () => {
    const before = "\"  one  \"\n'  two  '";
    const after = "\"one\"\n'two'";
    expect(normalizeWhitespaceInQuotes(before)).toBe(after);
  });

  it("handles empty quoted strings", () => {
    expect(normalizeWhitespaceInQuotes('""')).toBe('""');
    expect(normalizeWhitespaceInQuotes("''")).toBe("''");
  });

  it("handles quoted strings that contain only whitespace", () => {
    expect(normalizeWhitespaceInQuotes('"   "')).toBe('""');
    expect(normalizeWhitespaceInQuotes("'\n\t'")).toBe("''");
  });

  it("normalizes real-world style attribute with newlines and spaces", () => {
    const before = `style="
    width: 100%; height: 100%;
    object-fit: cover;
    object-position: 50% 50%;
  "`;
    const after = 'style="width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%;"';
    expect(normalizeWhitespaceInQuotes(before)).toBe(after);
  });
});
