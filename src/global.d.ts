/// <reference types="@emotion/react/types/css-prop" />
/// <reference types="vite-plugin-pwa/vanillajs" />

declare module "*.md" {
  import type { Root } from "mdast";
  const ast: Root;
  export default ast;
}
