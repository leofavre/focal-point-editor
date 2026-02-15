import type { List, ListItem, Root, RootContent } from "mdast";

type NodeWithText = { type?: string; value?: string; children?: NodeWithText[] };

/** Get plain text from any mdast node (recursively). */
export function getText(node: NodeWithText): string {
  if (node.type === "text" && typeof node.value === "string") return node.value;
  if (Array.isArray(node.children)) return node.children.map((c) => getText(c)).join("");
  return "";
}

export type HowToUseFromReadme = {
  title: string;
  tagline: string;
  steps: { title: string; detail: string }[];
};

/** Extract title, tagline, and "How it works" steps from README AST. */
export function extractHowToUseFromReadme(ast: Root): HowToUseFromReadme {
  const nodes = ast.children;
  let title = "";
  let tagline = "";
  const steps: HowToUseFromReadme["steps"] = [];

  const h1 = nodes.find((n) => n.type === "heading" && n.depth === 1);
  if (h1?.type === "heading") title = getText(h1);

  const firstParagraph = nodes.find((n) => n.type === "paragraph");
  if (firstParagraph?.type === "paragraph") tagline = getText(firstParagraph);

  const howIdx = nodes.findIndex(
    (n) => n.type === "heading" && n.depth === 2 && getText(n) === "How it works",
  );
  if (howIdx >= 0) {
    const next = nodes[howIdx + 1];
    if (next?.type === "list") {
      const list = next as List;
      for (const item of list.children) {
        const listItem = item as ListItem;
        const firstParagraph = listItem.children.find((c) => c.type === "paragraph");
        const nestedList = listItem.children.find((c) => c.type === "list");
        const stepTitle = firstParagraph ? getText(firstParagraph as RootContent) : "";
        let detail = "";
        if (nestedList?.type === "list") {
          const firstNestedItem = nestedList.children[0];
          if (firstNestedItem?.type === "listItem") {
            const p = firstNestedItem.children.find((c) => c.type === "paragraph");
            if (p) detail = getText(p as RootContent);
          }
        }
        steps.push({ title: stepTitle, detail });
      }
    }
  }

  return { title, tagline, steps };
}
