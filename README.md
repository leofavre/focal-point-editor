# Focal Point Editor

Crop images in responsive layouts without losing what matters most.

## How it works

1. **Choose an image**
   - Select an image from your device. It’s kept locally, so it can be edited offline. No uploads.

2. **Edit the focal point**
   - Drag slider to test how the image adapts to different aspect ratios. Set a focal point to keep important areas visible as the container changes.

3. **Grab the code**
   - When you’re done, copy the HTML and CSS code to use the image in full-width banners and responsive layouts.

## Prerequisites

Node.js and Yarn. The project pins versions via [Volta](https://volta.sh/) in `package.json` (Node 24.13.0, Yarn 4.9.2). Install Volta and `node` and `yarn` will be set automatically in this repo; otherwise, use any Node 24.x and Yarn 4.x.

## Setup and run

```bash
yarn install
yarn dev
```

## Scripts

| Command | Purpose |
| --- | --- |
| `yarn dev` | Start dev server |
| `yarn build` | Production build |
| `yarn preview` | Preview production build locally |
| `yarn typecheck` | Run type check only |
| `yarn test` | Run tests in watch mode |
| `yarn test:run` | Run tests once and exit the script |
| `yarn lint` | Check code style |
| `yarn lint:fix` | Fix code style |

## Tech stack

- React 19, TypeScript and Vite 7 for the core stack
- Emotion for styling
- React Router for routing
- IndexedDB for persistence
- Vite Plugin PWA for offline support
- Vitest for testing
- Biome for linting

## Deployment and CI

[Netlify](https://www.netlify.com/) deploys from `yarn build` with publish directory `dist` (see [netlify.toml](netlify.toml)). [GitHub Actions](.github/workflows/ci.yml) run typecheck, tests and Netlify deploy; pull requests get a deploy preview. [Release Please](https://github.com/googleapis/release-please) manages version bumps and changelog updates from conventional commits. Merging the release PR triggers the GitHub release and production deploy (deploy runs after the release step).

## License and author

[MIT](LICENSE). [Leonardo Favre](https://github.com/leofavre). [leofavre/focal-point-editor](https://github.com/leofavre/focal-point-editor).
