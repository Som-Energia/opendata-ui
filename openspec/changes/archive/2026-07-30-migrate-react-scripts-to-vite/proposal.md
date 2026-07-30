# Proposal: Migrate react-scripts@5.0.1 to Vite

## Intent

`react-scripts@5.0.1` is a dead toolchain with 79+ transitive CVEs and no upstream fixes. Vite replaces it with a modern, fast, actively maintained build tool that improves DX and eliminates security debt.

## Scope

### In Scope
- Swap build tool: remove `react-scripts`, add `vite` + `@vitejs/plugin-react`
- Move `public/index.html` to root, replace `%PUBLIC_URL%`, inject Vite entry script
- Migrate test runner from Jest to Vitest (one dummy test only)
- Update `scripts/deploy.sh` to sync `dist/` instead of `build/`
- Update `.gitignore` from `/build` to `/dist`
- Preserve absolute imports (`jsconfig.json` `baseUrl: "src"`) via `vite-jsconfig-paths` or `resolve.alias`
- Adjust ESLint config: remove `react-app` / `react-app/jest`, keep `standard` + `prettier`
- Update `.github/workflows/main.yml` test command

### Out of Scope
- React version bump (stays 17)
- MUI v4 → v5 migration
- Component logic or feature changes
- Service worker / PWA work
- Node version alignment (`.nvmrc` 22 vs CI 20)

## Capabilities

### New Capabilities
None — pure tooling migration; no user-facing behavior changes.

### Modified Capabilities
None — requirements remain unchanged.

## Approach

**Test runner**: Switch to Vitest. The project has exactly one dummy test (`App.test.js`). Configuring standalone Jest (jsdom, transform, ESM) costs more than migrating to Vitest, which shares Vite’s config and runs natively. Add `vitest`, `@vitest/ui`, `jsdom`, and `@testing-library/jest-dom` (vitest-compatible import). Create `vitest.setup.js` replacing `src/setupTests.js`.

**Absolute imports**: Add `vite-jsconfig-paths` plugin so `jsconfig.json` `baseUrl: "src"` continues to resolve imports like `components/Filters` without manual aliases.

**Base path**: Map `homepage: "/ui"` in `package.json` to `base: '/ui/'` in `vite.config.js` so production assets load correctly under the `/ui` deploy prefix.

**ESLint**: Remove `eslintConfig` entries from `package.json`. `standard` remains the primary linter. Optionally add `eslint-plugin-react-hooks` if hook rules are desired later.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | Remove `react-scripts`; add Vite + Vitest deps; update scripts; adjust `eslintConfig` |
| `public/index.html` → `index.html` | Moved/Rewritten | Root-level HTML with Vite entry script; `%PUBLIC_URL%` → relative paths |
| `vite.config.js` | New | Vite + React plugin, `base: '/ui/'`, `jsconfigPaths`, `test` block |
| `src/App.test.js` | Modified | Update to Vitest globals / imports; fix dummy assertion |
| `src/setupTests.js` | Replaced by `vitest.setup.js` | Import `@testing-library/jest-dom/vitest` |
| `scripts/deploy.sh` | Modified | Change `build/` references to `dist/` |
| `.gitignore` | Modified | Replace `/build` with `/dist` |
| `.github/workflows/main.yml` | Modified | Update `npm run test` to Vitest command |
| `jsconfig.json` | Unchanged | Reused via `vite-jsconfig-paths` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| ESLint rule loss (`react-app`, `jsx-a11y`) | High | Acceptable for now; `standard` covers basics. Re-add `eslint-plugin-react-hooks` later if needed. |
| Deploy path mismatch (`build` → `dist`) | Medium | Update `deploy.sh` and `.gitignore`; verify rsync target in staging. |
| CI test command breaks | Medium | Update workflow to `npx vitest run`; test on PR before merge. |
| Absolute import resolution fails | Low | Use `vite-jsconfig-paths` and validate via `npm run build`. |

## Rollback Plan

1. Revert the commit.
2. Re-install `react-scripts@5.0.1` and restore original `package.json` scripts.
3. Restore `public/index.html` and delete root `index.html`.
4. Restore `.gitignore` `/build` entry and `scripts/deploy.sh` `build/` path.
5. Delete `vite.config.js` and `vitest.setup.js`.
6. Restore `src/setupTests.js` and original `src/App.test.js`.

## Dependencies

None — all changes are self-contained within the repo.

## Success Criteria

- [ ] `npm run build` produces a working production bundle in `dist/`
- [ ] `npm run test` passes the migrated dummy test under Vitest
- [ ] `npm start` (dev server) launches the app successfully
- [ ] Absolute imports (`components/Filters`, `images/cuca.svg`) resolve without error
- [ ] `scripts/deploy.sh` syncs `dist/` correctly
- [ ] CI workflow passes on the PR
- [ ] No `react-scripts` transitive CVEs remain in the dependency tree
