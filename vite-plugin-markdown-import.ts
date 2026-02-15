import fs from "node:fs";
import remarkParse from "remark-parse";
import { unified } from "unified";

/**
 * Vite plugin: import .md files as a Markdown AST (MDAST) JSON object.
 * No frontmatter — the raw markdown is parsed into a tree (root with children:
 * headings, paragraphs, lists, etc.). Use the AST in your layout.
 *
 * Usage: import readme from "../../README.md"
 * Then: readme.children (array of nodes), traverse by type and content.
 */
export function markdownImport() {
  const processor = unified().use(remarkParse);
  return {
    name: "markdown-import",
    enforce: "pre" as const,
    load(id: string) {
      const filePath = id.split("?")[0];
      if (!filePath.endsWith(".md")) return null;
      const raw = fs.readFileSync(filePath, "utf-8");
      const ast = processor.parse(raw);
      return `export default ${JSON.stringify(ast)}`;
    },
  };
}
