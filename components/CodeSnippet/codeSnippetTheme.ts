import type { PrismTheme } from "prism-react-renderer";

/**
 * Code snippet syntax theme using project CSS variables from main.css.
 * Inline styles accept var() and resolve at runtime, so colors stay in sync automatically.
 */
export const codeSnippetTheme: PrismTheme = {
  plain: {
    color: "var(--color-body)",
    backgroundColor: "var(--color-zero)",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "var(--color-codesnippet-comment)",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "var(--color-codesnippet-punctuation)",
      },
    },
    {
      types: ["tag", "attr-name"],
      style: {
        color: "var(--color-codesnippet-tag)",
      },
    },
    {
      types: ["string", "char", "attr-value", "inserted", "entity", "url"],
      style: {
        color: "var(--color-codesnippet-string)",
      },
    },
    {
      types: [
        "keyword",
        "variable",
        "boolean",
        "operator",
        "number",
        "property",
        "function",
        "constant",
        "symbol",
      ],
      style: {
        color: "var(--color-codesnippet-keyword)",
      },
    },
    {
      types: ["deleted"],
      style: {
        color: "var(--color-codesnippet-punctuation)",
      },
    },
  ],
};
