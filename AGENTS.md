# AGENTS.md — Open Data UI

> **Som Energia** web UI for the Open Data API.
> React 17 SPA that lets non-programmers query public cooperative data (members, contracts, energy usage, etc.).

## Commands

| Task | Command | Notes |
|------|---------|-------|
| Install deps | `npm install` | |
| Start dev server | `npm run start` | Vite dev server, HMR on `http://localhost:5173` |
| Run tests | `npm run test` | Runs `vitest` (single run, no watch) |
| Run tests (watch) | `npx vitest` | Watch mode for TDD |
| Production build | `npm run build` | Outputs to `dist/` |
| Preview production build | `npx vite preview` | Serves `dist/` locally |
| Lint | `npx standard` | |
| Deploy | `scripts/deploy.sh <environment>` | Requires `scripts/deploy-<env>.conf` |

## Tech Stack

- **React 17** + **Vite 5** (`@vitejs/plugin-react`) — no CRA, no `react-scripts`
- **Material-UI v4** (`@material-ui/core`) — most UI components
- **MUI X Date Pickers v6** (`@mui/x-date-pickers`) — only the date pickers; requires `AdapterMoment`
- **Styling**: Material-UI `makeStyles` + a custom theme in `App.jsx`
- **HTTP**: `axios`
- **i18n**: `react-i18next` with 4 locales (`ca`, `es`, `gl`, `eu`)
- **Lint**: `standard` (JS Standard Style)
- **Format**: Prettier with `prettier-config-standard`
- **Test**: Vitest 2 + `@testing-library/react` v11 + `jsdom`

## Architecture

```
src/
  App.jsx             — Root component, theme provider, layout, state for filters/response
  components/
    Filters.jsx       — Main filter form (metric, geo level, dates, etc.)
    Disclaimer.jsx    — Warning banner
    Uri.jsx           — Live URL preview as filters change
    formats/
      TableData.jsx   — Table display
      JsonData.jsx    — JSON display
      YamlData.jsx    — YAML display
  services/
    api.js            — Axios wrapper for `https://opendata.somenergia.coop/v0.2`
    utils.js          — URL builder, geo level loading, CSV flattening logic
  i18n/
    i18n.js           — i18next setup; `keySeparator: false` (literal keys, no nesting)
    locale-*.json     — Translation files
```

**Entry points**: `index.html` → `src/index.jsx` → `src/App.jsx`.

**API base URL**: hardcoded in `src/services/utils.js` as `https://opendata.somenergia.coop/v0.2`.

**Build output**: Vite outputs to `dist/` with `base: '/ui/'` so assets are served under the `/ui` prefix.

## Import Conventions

- **Absolute imports from `src/`**: enabled by `jsconfig.json` (`baseUrl: "src"`) + `resolve.alias` in `vite.config.js`.
- Examples: `import Filters from 'components/Filters'`; `import cuca from 'images/cuca.svg'`.
- Do not change `jsconfig.json` or `vite.config.js` without verifying both stay in sync.

## Testing

- Runner: **Vitest** (not Jest). Shared config with Vite via `vite.config.js`.
- Library: `@testing-library/react` v11 (older API; **no `screen` in all contexts** — check existing tests first).
- **Current tests**: `src/App.test.jsx` — verifies the app renders with `getByAltText(/Cuca de Som Energia/i)`. **It passes.**
- DOM matchers: `@testing-library/jest-dom` v6, imported in `vitest.setup.js` via `@testing-library/jest-dom/vitest`.
- Coverage: `npx vitest run --coverage` (requires `@vitest/coverage-v8` installed).
- CI does not enforce a coverage threshold.

## i18n — Key Rules

- **No nested keys**: `keySeparator: false` in `i18n.js`. Keys are literal strings like `"NO_DATA"` or `"MEMBERS"`.
- Translation strings are looked up **exactly** as written in the JSON files.
- When adding a new UI string, add it to **all four** `locale-*.json` files.
- Fallback language is `es`.

## Code Style

- Follow **JavaScript Standard Style** (`standard`).
- Prettier config is inherited from `prettier-config-standard` — do not add a local `.prettierrc` unless required.
- Semicolons are **omitted** (Standard Style).
- All components use `.jsx` extension (Vite Rollup parser requirement).

## Date Handling

- Uses **Moment.js** (not Day.js for the date pickers, despite `dayjs` being in dependencies).
- `Filters.jsx` imports `AdapterMoment` and wraps the app in `LocalizationProvider`.
- Date format in UI: `DD/MM/YYYY`.

## Deployment

- Deploy script: `scripts/deploy.sh <env>`.
- Requires a sibling config file: `scripts/deploy-<env>.conf` with `DEPLOYMENT_HOST`, `DEPLOYMENT_PORT`, `DEPLOYMENT_USER`, `DEPLOYMENT_PATH`.
- The script runs `npm run build` and rsyncs the **`dist/`** folder (Vite output target, already updated in the script).
- If `DEPLOYMENT_BUILD` is set in the config (e.g. `production`), the script runs `npm run build:<env>`. There is **no** `build:<env>` script in `package.json` — the deploy script works out of the box when `DEPLOYMENT_BUILD` is unset (just `npm run build`). If you need mode-specific builds, update the deploy script to `vite build --mode $DEPLOYMENT_BUILD` and add a corresponding `.env.<env>` file.
- **No `.env*` files are tracked in git** — they are created locally or in the deployment repo.

## CI / GitHub Actions

- Workflow: `.github/workflows/main.yml`.
- Runs on Node 20 (`.nvmrc` says v22, but CI matrix uses 20 — consider updating CI to v22).
- Steps: `npm install` → `npm install coveralls --save-dev` → `npx vitest run`.
- Uses `actions/checkout@v2` (older version — consider upgrading to v4).

## Known Quirks

- **MUI version hybrid**: Most components are Material-UI v4, but date pickers come from MUI X v6. Do not upgrade one without checking the other.
- **YAML padding hack**: `utils.js` has a workaround for `js-yaml` incorrectly parsing zero-padded numeric codes (e.g. `08` → `8`). If you touch geo level parsing, preserve the `paddingHack` function.
- **Map responses**: when the URL contains `/map/`, `api.js` requests a `blob` and returns an object URL (`blob:...`). `App.js` renders this as an `<img>`.
- **No routing**: Single page, no `react-router`. Tabs (Table/YAML/JSON) are local state.
- **State management**: Plain React `useState` in `App.js`. No Redux, no context.

## Adding a New Metric or Geo Level

1. The API drives metrics/geo levels dynamically via `/discover/metrics` and `/discover/geolevel`.
2. If the API changes, `Filters.js` and `utils.js` adapt automatically.
3. If you need to hardcode a new geo level, update `geoLevels` and `pluralGeoLevels` arrays in `services/utils.js`.

## When in Doubt

- Check `README.md` for quick start.
- Check `package.json` for exact dependency versions (some are pinned to specific majors).
