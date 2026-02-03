/// <reference types="@emotion/react/types/css-prop" />
/// <reference types="vite-plugin-pwa/vanillajs" />

declare module '*.md' {
  import React from 'react'
  const ReadmeContent: React.VFC;
  export { ReadmeContent };
}
