import type { CodeSnippetLanguage } from "@/src/types";

export function getLanguageFromOptions(
  useReact: boolean,
  useTailwind: boolean,
): CodeSnippetLanguage {
  if (useReact && useTailwind) return "react-tailwind";
  if (useReact) return "react";
  if (useTailwind) return "tailwind";
  return "html";
}

function getCodeSnippetHtml(src: string, objectPosition: string): string {
  return `<img
  src="${src}"
  style="
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${objectPosition};
  "
/>`;
}

function getCodeSnippetReact(src: string, objectPosition: string): string {
  return `<img
  src="${src}"
  style={{
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: '${objectPosition}',
  }}
/>`;
}

function getCodeSnippetTailwind(src: string, objectPosition: string): string {
  const objectPositionClass = objectPosition.replace(/ /g, "_");
  return `<img
  src="${src}"
  class="
    w-full
    h-full
    object-cover
    object-[${objectPositionClass}]
  "
/>`;
}

function getCodeSnippetReactTailwind(src: string, objectPosition: string): string {
  const objectPositionClass = objectPosition.replace(/ /g, "_");
  return `<img
  src="${src}"
  className="
    w-full
    h-full
    object-cover
    object-[${objectPositionClass}]
  "
/>`;
}

export type GetCodeSnippetOptions = {
  language: CodeSnippetLanguage | undefined;
  src: string;
  objectPosition: string;
};

export function getCodeSnippet(options: GetCodeSnippetOptions): string {
  const { language, src, objectPosition } = options;

  switch (language) {
    case "tailwind":
      return getCodeSnippetTailwind(src, objectPosition);

    case "react":
      return getCodeSnippetReact(src, objectPosition);

    case "react-tailwind":
      return getCodeSnippetReactTailwind(src, objectPosition);

    default:
      return getCodeSnippetHtml(src, objectPosition);
  }
}

export function getCodeBlockLanguage(language: CodeSnippetLanguage | undefined): "jsx" | "html" {
  return language === "react" || language === "react-tailwind" ? "jsx" : "html";
}
