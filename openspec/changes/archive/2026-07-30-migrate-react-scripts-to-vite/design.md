# Design: Migrate react-scripts@5.0.1 to Vite

## Technical Approach

Swap the dead `react-scripts` toolchain for Vite in a single atomic commit. Preserve React 17, MUI v4, absolute `jsconfig.json` imports, and the `/ui` deploy prefix. No runtime behavior changes.

## Architecture Decisions

| Decision | Choice | Rejected | Rationale |
|---|---|---|---|
| Build tool | Vite 5 + `@vitejs/plugin-react` | Parcel, Next.js, keep react-scripts | One config file, sub-second HMR, active maintenance, eliminates 79+ transitive CVEs. |
| Test runner | Vitest | Standalone Jest + jsdom + babel-jest | Shares Vite config, native ESM, one dummy test makes Jest setup cost unjustified. |
| Absolute imports | `vite-jsconfig-paths` | Manual `resolve.alias` | Reads existing `jsconfig.json` automatically; zero manual maintenance. |

## File Changes

| File | Action | Description |
|---|---|---|
| `package.json` | Modify | Remove `react-scripts`, `eslintConfig`; add `vite`, `@vitejs/plugin-react`, `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/jest-dom` v6, `vite-jsconfig-paths`. Update scripts: `start` → `vite`, `build` → `vite build`, `test` → `vitest`. |
| `vite.config.js` | Create | `base: '/ui/'`; plugins: `@vitejs/plugin-react()`, `viteJsconfigPaths()`; `test: { globals: true, environment: 'jsdom', setupFiles: './vitest.setup.js' }`. |
| `index.html` | Move/rewrite | Root-level file from `public/index.html`. Replace `%PUBLIC_URL%` with `./` relative paths. Inject `<script type="module" src="/src/index.js"></script>` in `<body>`. Keep meta tags and Google Fonts link. |
| `vitest.setup.js` | Create | `import '@testing-library/jest-dom/vitest'` (v6 vitest entry point). |
| `src/App.test.js` | Modify | Switch to Vitest globals; replace broken "learn react" dummy assertion with a smoke test that expects real app text (e.g. `screen.getByText(/Som Energia/i)`). |
| `src/setupTests.js` | Delete | Replaced by `vitest.setup.js`. |
| `scripts/deploy.sh` | Modify | Change `rsync` source from `../build/*` to `../dist/*` (line 85). |
| `.gitignore` | Modify | Replace `/build` with `/dist`. |
| `.github/workflows/main.yml` | Modify | Change `npm run test` to `npx vitest run`. |
| `jsconfig.json` | Unchanged | Reused by `vite-jsconfig-paths`. |

## Data Flow

No runtime data flow changes. Build pipeline:

    npm start   → vite dev server → HMR → unchanged React 17 app
    npm run build → vite → dist/ with base /ui/ → deploy.sh rsync dist/

## Testing Strategy

| Layer | What | Approach |
|---|---|---|
| Unit | Vitest setup, DOM matchers, smoke test | `vitest.setup.js` imports v6 vitest entry; `App.test.js` renders `<App />` and asserts real text node exists. |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary beyond a static path change in `deploy.sh`.

## Migration / Rollout

### Sequence

1. Add new files: `vite.config.js`, `vitest.setup.js`, root `index.html`.
2. Modify `package.json` (deps + scripts).
3. Delete `public/index.html` and `src/setupTests.js`.
4. Modify `src/App.test.js`, `scripts/deploy.sh`, `.gitignore`, `.github/workflows/main.yml`.
5. Run `npm install`, `npm run build`, `npx vitest run`, `npm start` locally to verify.
6. Commit as one atomic change.

### Rollback Plan

1. Revert the commit.
2. Re-install `react-scripts@5.0.1` via restored `package.json` (`npm install`).
3. Restore `public/index.html`; delete root `index.html`.
4. Restore `src/setupTests.js`; delete `vitest.setup.js`.
5. Restore `scripts/deploy.sh` `../build/*` path and `.gitignore` `/build` entry.
6. Delete `vite.config.js`.

## Open Questions

None.
