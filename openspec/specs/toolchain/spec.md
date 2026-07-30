# Delta Spec: Migrate react-scripts to Vite

## Purpose
Replace the unmaintained `react-scripts@5.0.1` toolchain with Vite, eliminating transitive CVEs while preserving dev server, production build, test, and deploy behavior.

## ADDED Requirements

### Requirement: Vite Dev Server
The system MUST provide a dev server via `npm start` using Vite that serves the application on a local port.

#### Scenario: Dev server starts
- GIVEN Vite and `@vitejs/plugin-react` are installed
- WHEN `npm start` is executed
- THEN the dev server launches successfully
- AND the application renders in a browser without errors

### Requirement: Vite Production Build
The system MUST emit a production bundle to `dist/` with asset paths prefixed by `/ui/`.

#### Scenario: Production build outputs to dist/
- GIVEN `vite.config.js` sets `base: '/ui/'`
- WHEN `npm run build` is executed
- THEN static assets are emitted to `dist/`
- AND asset URLs are prefixed with `/ui/`

### Requirement: Vitest Test Runner
The system MUST run the existing test suite under Vitest with `@testing-library/jest-dom` matchers available.

#### Scenario: Tests pass under Vitest
- GIVEN `vitest.setup.js` imports `@testing-library/jest-dom/vitest`
- WHEN `npm run test` is executed
- THEN the dummy test in `src/App.test.js` passes
- AND `expect` DOM matchers resolve correctly

### Requirement: Vite Absolute Import Resolution
The system MUST resolve absolute imports from `src/` using `vite-jsconfig-paths` or equivalent alias configuration.

#### Scenario: Absolute imports resolve
- GIVEN `jsconfig.json` defines `baseUrl: "src"`
- WHEN source code imports `components/Filters` or `images/cuca.svg`
- THEN the module resolves correctly in dev and production builds

## MODIFIED Requirements

### Requirement: Deploy Script Output Directory
The deployment script MUST sync the production bundle from `dist/` instead of `build/`.

(Previously: `rsync` sourced from `build/`)

#### Scenario: Deploy script syncs dist/
- GIVEN `scripts/deploy.sh` is updated
- WHEN the deploy script executes
- THEN `rsync` transfers files from `dist/*`
- AND the remote symlink points to the uploaded version

### Requirement: Git Ignore Build Output
The repository MUST ignore `/dist` instead of `/build`.

(Previously: `.gitignore` excluded `/build`)

#### Scenario: Git ignore updated
- GIVEN `.gitignore` is modified
- WHEN Git tracks working directory changes
- THEN `/dist` is excluded and `/build` is no longer ignored

### Requirement: CI Test Command
The CI workflow MUST invoke the Vitest test runner.

(Previously: CI invoked `react-scripts test`)

#### Scenario: CI passes
- GIVEN `.github/workflows/main.yml` is updated
- WHEN the CI workflow runs
- THEN `npx vitest run` executes successfully

## REMOVED Requirements

### Requirement: react-scripts Toolchain
(Reason: `react-scripts@5.0.1` is unmaintained with 79+ transitive CVEs; Vite replaces build, dev, and test orchestration.)
(Migration: Remove `react-scripts` from `package.json`; delete `public/index.html` after moving to root `index.html`.)

### Requirement: Jest via react-scripts
(Reason: Test runner replaced by Vitest.)
(Migration: Delete `src/setupTests.js`; create `vitest.setup.js`.)

### Requirement: CRA ESLint Presets
(Reason: `eslintConfig` entries `react-app` and `react-app/jest` are tied to react-scripts.)
(Migration: Remove `eslintConfig` from `package.json`; `standard` remains the primary linter.)

## Non-Functional Requirements

| Requirement | Description |
|---|---|
| No user-facing changes | The rendered UI and behavior MUST remain identical after the migration. |
| Build time | `npm run build` SHOULD NOT take longer than the previous react-scripts build. |
| Runtime dependencies | No new runtime dependencies MAY be added to the production bundle. |
| React 17 | The system MUST continue to use React 17 without version changes. |
| MUI v4 | The system MUST continue to use Material-UI v4 without migration. |
| Standard JS | `standard` MUST remain the primary linting rule set. |
| Node 22 | The system MUST be compatible with Node 22. |

## Constraints

- React 17, MUI v4, `standard`, and Node 22 are fixed.
- No `REACT_APP_*` environment variables exist in the codebase.
- No service worker or PWA registration exists.
