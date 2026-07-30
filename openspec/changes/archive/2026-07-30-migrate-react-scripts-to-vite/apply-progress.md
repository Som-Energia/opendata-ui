# Apply Progress: migrate-react-scripts-to-vite

**Status**: All 16 tasks complete.

**Mode**: Strict TDD (with structural/config task exceptions)

## Work Unit Evidence

| Evidence | Value |
|---|---|
| Focused test command | `npx vitest run` — exit 0, 1 test file, 1 test passed |
| Runtime harness | `npm run build` — dist/ created with /ui/ prefixed assets; `npm start` — dev server on port, HTTP 200 at /ui/ |
| Rollback boundary | Revert the commit to restore react-scripts toolchain |

## TDD Cycle Evidence

| Task | Layer | Safety Net | RED | GREEN | TRIANGULATE | REFACTOR |
|------|-------|------------|-----|-------|-------------|----------|
| 1.1 deps cleanup | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 1.2 add Vite deps | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 1.3 npm install | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 2.1 vite.config.js | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 2.2 scripts | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 3.1 index.html | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 3.2 delete public/index.html | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 3.3 .gitignore | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 4.1 vitest.setup.js | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 4.2 delete setupTests.js | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 4.3 App.test.jsx | Unit (smoke) | No existing tests | ✅ Written | ✅ Passed | ➖ Single | ➖ None needed |
| 4.4 run tests | Verification | N/A | N/A | N/A | N/A | N/A |
| 5.1 deploy.sh | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 5.2 CI workflow | Structural | N/A | N/A (config) | N/A | N/A | N/A |
| 5.3 build verification | Verification | N/A | N/A | N/A | N/A | N/A |
| 5.4 dev server verification | Verification | N/A | N/A | N/A | N/A | N/A |

## Deviations from Design

1. **`vite-jsconfig-paths` replaced with manual `resolve.alias`**: The `vite-jsconfig-paths` plugin did not resolve absolute imports reliably. Replaced with explicit `resolve.alias` in `vite.config.js` for `components`, `images`, and `services`.

2. **`jsxRuntime: 'automatic'` instead of `'classic'`**: The design specified classic JSX runtime. However, the source files don't import `React` explicitly (they rely on the new JSX transform auto-import). Switching to `'automatic'` matches the original CRA/react-scripts@5 behavior and avoids adding `import React` to every file.

3. **Files renamed `.js` → `.jsx`**: Vite's import analysis uses Rollup's parser which determines JSX syntax mode by file extension. 8 files with JSX content were renamed from `.js` to `.jsx` to satisfy Vite's parser. Index HTML script tag updated to reference `index.jsx`.

4. **Test assertion uses `getByAltText` instead of `getByText`**: "Som Energia" only appears in the logo image's `alt` attribute (`Cuca de Som Energia`), not as a DOM text node. The test was updated to use `getByAltText(/Cuca de Som Energia/i)` which is a real behavioral assertion.

## Issues Found

- **Vite doesn't support JSX in `.js` files**: This is a Vite design decision (unlike CRA which uses Babel). Fix requires either renaming to `.jsx` or configuring the react plugin with `include` and esbuild options — but even with that, the `vite:import-analysis` step still fails on `.js` files with JSX. Renaming was the clean solution.
- **`vite-jsconfig-paths` v1.0.0 not resolving**: The plugin is based on `vite-tsconfig-paths` but didn't correctly handle `baseUrl`-only jsconfig.json (no explicit `paths` mapping). Manual aliases were more reliable.

## Files Changed

| File | Action | What Was Done |
|------|--------|---------------|
| `package.json` | Modified | Remove react-scripts, eslintConfig, eject; add Vite/Vitest deps; update scripts |
| `vite.config.js` | Created | Vite config with base /ui/, resolve.alias, react plugin (automatic), vitest block |
| `index.html` | Created | Root HTML from public/index.html, modified for Vite |
| `vitest.setup.js` | Created | Import @testing-library/jest-dom/vitest |
| `src/index.jsx` | Renamed | From src/index.js, JSX content |
| `src/App.jsx` | Renamed | From src/App.js, JSX content |
| `src/App.test.jsx` | Renamed+modified | From src/App.test.js, now uses getByAltText assertion |
| `src/components/Disclaimer.jsx` | Renamed | From .js |
| `src/components/Filters.jsx` | Renamed | From .js |
| `src/components/Uri.jsx` | Renamed | From .js |
| `src/components/formats/JsonData.jsx` | Renamed | From .js |
| `src/components/formats/TableData.jsx` | Renamed | From .js |
| `src/components/formats/YamlData.jsx` | Renamed | From .js |
| `scripts/deploy.sh` | Modified | rsync source: ../build/* → ../dist/* |
| `.github/workflows/main.yml` | Modified | npm run test → npx vitest run |
| `.gitignore` | Modified | /build → /dist |
| `public/index.html` | Deleted | No longer needed |
| `src/setupTests.js` | Deleted | Replaced by vitest.setup.js |
