# Tasks: Migrate react-scripts to Vite

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~120 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | ask-always |
| Chain strategy | pending |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: pending
400-line budget risk: Low

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Full migration | PR 1 | `npx vitest run` | `npm run build && npm start` | Revert commit to restore react-scripts toolchain |

## Phase 1: Setup

- [x] **1.1** (S) Remove `react-scripts`, `eslintConfig`, and the `eject` script from `package.json` — touches `package.json` — verify: `eslintConfig` absent and `react-scripts` removed — deps: none
- [x] **1.2** (S) Add `vite`, `@vitejs/plugin-react`, `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/jest-dom`, and `vite-jsconfig-paths` to `package.json` devDependencies — touches `package.json` — verify: all packages listed in devDependencies — deps: 1.1
- [x] **1.3** (S) Run `npm install` to regenerate `package-lock.json` with the new dependency tree — touches `package-lock.json` — verify: install succeeds with no unresolvable peer conflicts — deps: 1.2

## Phase 2: Config

- [x] **2.1** (S) Create `vite.config.js` with `base: '/ui/'`, `@vitejs/plugin-react()`, `viteJsconfigPaths()`, and Vitest `test` block (`globals: true`, `environment: 'jsdom'`, `setupFiles: './vitest.setup.js'`) — touches `vite.config.js` — verify: `npx vite` parses config without error — deps: 1.3
- [x] **2.2** (S) Update `package.json` scripts: `start` → `vite`, `build` → `vite build`, `test` → `vitest` — touches `package.json` — verify: scripts match design doc — deps: 2.1

## Phase 3: Assets

- [x] **3.1** (S) Create root `index.html` from `public/index.html`, replace `%PUBLIC_URL%` with `./`, inject `<script type="module" src="/src/index.js"></script>` in `<body>`, keep meta tags and Google Fonts link — touches `index.html` — verify: file exists at repo root with correct relative paths and script tag — deps: none
- [x] **3.2** (XS) Delete `public/index.html` — touches `public/index.html` — verify: file absent — deps: 3.1
- [x] **3.3** (XS) Update `.gitignore` to ignore `/dist` instead of `/build` — touches `.gitignore` — verify: `/dist` present, `/build` absent — deps: none

## Phase 4: Tests

- [x] **4.1** (XS) Create `vitest.setup.js` importing `@testing-library/jest-dom/vitest` (v6 entry point) — touches `vitest.setup.js` — verify: file exists with correct import — deps: 1.3
- [x] **4.2** (XS) Delete `src/setupTests.js` — touches `src/setupTests.js` — verify: file absent — deps: 4.1
- [x] **4.3** (S) Rewrite `src/App.test.js` as a Vitest smoke test that renders `<App />` and asserts real text node (`/Som Energia/i`) is in the document — touches `src/App.test.js` — verify: test file uses global `test`/`expect` and imports `screen` from `@testing-library/react` — deps: 4.1
- [x] **4.4** (S) Run `npx vitest run` locally to confirm the test suite passes with DOM matchers resolving correctly — touches none — verify: exit code 0 — deps: 4.3

## Phase 5: CI / Deploy

- [x] **5.1** (XS) Update `scripts/deploy.sh` line 85 to change rsync source from `../build/*` to `../dist/*` — touches `scripts/deploy.sh` — verify: script references `../dist/*` — deps: none
- [x] **5.2** (XS) Update `.github/workflows/main.yml` to replace `npm run test` with `npx vitest run` in the Unit tests step — touches `.github/workflows/main.yml` — verify: workflow step uses vitest — deps: 4.4
- [x] **5.3** (S) Run `npm run build` locally to verify production bundle emits to `dist/` with asset paths prefixed by `/ui/` — touches none — verify: `dist/` created and `index.html` contains `/ui/` asset URLs — deps: 2.2, 3.1
- [x] **5.4** (S) Run `npm start` locally to verify Vite dev server launches and the React 17 + MUI v4 app renders without runtime errors — touches none — verify: dev server starts on local port and app renders — deps: 2.2, 3.1
