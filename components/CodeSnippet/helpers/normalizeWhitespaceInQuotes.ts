/**
 * Collapses repeated whitespace (including line breaks) inside quoted strings to a single space.
 * Only modifies content between double or single quotes; leaves the rest of the string unchanged.
 */
export function normalizeWhitespaceInQuotes(text: string): string {
  return text.replace(
    /(")([^"]*)(")|(')([^']*)(')/g,
    (_match, _dqOpen, dqContent, _dqClose, _sqOpen, sqContent, _sqClose) => {
      const content = dqContent != null ? dqContent : (sqContent ?? "");
      const quote = dqContent != null ? '"' : "'";
      const normalized = content.replace(/\s+/g, " ").trim();
      return quote + normalized + quote;
    },
  );
}
