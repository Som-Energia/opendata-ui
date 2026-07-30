## Exploration: Migrate react-scripts@5.0.1 to Vite

### Current State

- React 17 SPA with `react-scripts@5.0.1`. Node 22 (`.nvmrc`), CI uses Node 20.
- 14 JS files, 2 CSS files, 4 SVG files, 4 JSON locale files in `src/`.
- Entry: `public/index.html` (with `%PUBLIC_URL%`) + `src/index.js` using `ReactDOM.render`.
- Absolute imports via `jsconfig.json` (`baseUrl: "src"`).
- No `REACT_APP_*` environment variables found.
- No service worker / PWA registration in code (`manifest.json` exists but is a generic CRA sample and unused by code).
- One dummy test `src/App.test.js` + `src/setupTests.js` using Jest via react-scripts.
- Lint/format: `standard` + `prettier-config-standard`; `eslintConfig` in `package.json` extends `react-app` and `react-app/jest`.
- CI: `.github/workflows/main.yml` runs `npm install` then `npm run test` (no build step).
- Deploy: `scripts/deploy.sh` runs `npm run build` and rsyncs `build/*`.

### Affected Areas

- `package.json` — must remove `react-scripts`, add `vite` + `@vitejs/plugin-react`, update scripts, remove/adjust `eslintConfig`, keep `standard`/`prettier`.
- `public/index.html` — must move to project root, replace `%PUBLIC_URL%` with relative paths, inject `<script type="module" src="/src/index.js"></script>`.
- `scripts/deploy.sh` — references `build/`; Vite outputs to `dist/`. Must update path.
- `.gitignore` — ignores `/build`; must change to `/dist`.
- `jsconfig.json` — Vite does not read `baseUrl` automatically; must either add `vite-jsconfig-paths` plugin or manually configure `resolve.alias` in `vite.config.js`.
- `src/App.js` — imports `cuca.svg` as URL. Works in Vite by default, but verify path resolution.
- `.github/workflows/main.yml` — must update `npm run test` command since `react-scripts test` disappears. Need to either configure Jest manually or switch to Vitest (recommended given only 1 test).
- `src/setupTests.js` — imports `@testing-library/jest-dom`. If switching to Vitest, needs `vitest.setup.js` with `@testing-library/jest-dom/vitest` or manual matchers.

### Approaches

1. **Keep Jest, add Vite**
   - Pros: Minimal test migration; existing `@testing-library/jest-dom` works; CI changes are small.
   - Cons: Jest config must be written from scratch (jest.config.js, jsdom environment, transform for JSX/ESM); dual config (Vite + Jest) is more maintenance.
   - Effort: Medium

2. **Switch to Vitest**
   - Pros: Native Vite integration; same config file; fast; `@testing-library/react` works with `vitest`; aligns with modern Vite ecosystem.
   - Cons: Slight syntax differences (`describe`, `it`, `expect` are globals in Vitest but can be imported); `jest-dom` matchers need `vitest.setup.js` with `expect.extend` or `@testing-library/jest-dom/vitest`.
   - Effort: Low (only 1 test file to migrate)

### Recommendation

Switch to Vitest. The project has exactly one test (`App.test.js`) that is currently a dummy failing test. The cost of configuring standalone Jest outweighs the benefit. Vitest requires adding `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, and `jsdom` as devDependencies, plus a small `vite.config.js` and `vitest.setup.js`. This is the simplest path.

### Risks

- **Absolute import breakage**: `jsconfig.json` is not honored by Vite. If `vite-jsconfig-paths` plugin is not used, imports like `components/Filters` will fail. Mitigation: add plugin or manual alias.
- **homepage / base path**: `homepage: "/ui"` in `package.json` sets CRA public path. Vite uses `base` config. Must set `base: '/ui/'` in `vite.config.js` or deploy will break.
- **SVG imports**: Vite returns URL for SVG imports by default, which matches current usage. No risk unless SVGR is needed later.
- **ESLint rule loss**: Removing `react-app` ESLint config loses built-in `jsx-a11y` and `react-hooks` rules. Standard JS alone does not enforce React hooks rules. Mitigation: add `eslint-plugin-react-hooks` manually if desired.
- **Node mismatch**: `.nvmrc` (v22) vs CI (Node 20). Vite runs on both, but aligning them is a separate concern.
- **Deployment script**: If `scripts/deploy.sh` is not updated to sync `dist/`, deployment will push an old or empty build directory.

### Ready for Proposal

Yes. The scope is well-defined: replace build tooling, migrate test runner, update deploy references, and verify absolute imports.
