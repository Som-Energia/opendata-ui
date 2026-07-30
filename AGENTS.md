# AGENTS.md — Open Data UI

> **Som Energia** web UI for the Open Data API.
> React 17 SPA that lets non-programmers query public cooperative data (members, contracts, energy usage, etc.).

## Commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Start dev server | `npm run start` |
| Run tests | `npm run test` |
| Production build | `npm run build` |
| Build with env file | `npm run build:<env>` (e.g. `npm run build:production`) |
| Deploy | `scripts/deploy.sh <environment>` (requires `scripts/deploy-<env>.conf`) |

## Tech Stack

- **React 17** + `react-scripts` 5.0.1 (Create React App, **not Vite**)
- **Material-UI v4** (`@material-ui/core`) — most UI components
- **MUI X Date Pickers v6** (`@mui/x-date-pickers`) — only the date pickers; requires `AdapterMoment`
- **Styling**: Material-UI `makeStyles` + a custom theme in `App.js`
- **HTTP**: `axios`
- **i18n**: `react-i18next` with 4 locales (`ca`, `es`, `gl`, `eu`)
- **Lint**: `standard` (JS Standard Style)
- **Format**: Prettier with `prettier-config-standard`

## Architecture

```
src/
  App.js              — Root component, theme provider, layout, state for filters/response
  components/
    Filters.js        — Main filter form (metric, geo level, dates, etc.)
    Disclaimer.js     — Warning banner
    Uri.js            — Live URL preview as filters change
    formats/
      TableData.js    — Table display
      JsonData.js     — JSON display
      YamlData.js     — YAML display
  services/
    api.js            — Axios wrapper for `https://opendata.somenergia.coop/v0.2`
    utils.js          — URL builder, geo level loading, CSV flattening logic
  i18n/
    i18n.js           — i18next setup; `keySeparator: false` (literal keys, no nesting)
    locale-*.json     — Translation files
```

**Entry points**: `src/index.js` → `src/App.js`.

**API base URL**: hardcoded in `src/services/utils.js` as `https://opendata.somenergia.coop/v0.2`.

## Import Conventions

- **Absolute imports from `src/`**: enabled by `jsconfig.json` (`baseUrl: "src"`).
- Examples: `import Filters from 'components/Filters'`; `import cuca from 'images/cuca.svg'`.
- Do not change `jsconfig.json` without a strong reason.

## Testing

- Runner: Jest via `react-scripts test`.
- Library: `@testing-library/react` v11 (older API; **no `screen` in all contexts** — check existing tests first).
- **Current tests**: only `src/App.test.js`, which is a stale CRA default looking for "learn react" text. **It fails.** If you change UI text, update or remove this test.
- No coverage script defined in `package.json`. CI installs `coveralls` on the fly.

## i18n — Key Rules

- **No nested keys**: `keySeparator: false` in `i18n.js`. Keys are literal strings like `"NO_DATA"` or `"MEMBERS"`.
- Translation strings are looked up **exactly** as written in the JSON files.
- When adding a new UI string, add it to **all four** `locale-*.json` files.
- Fallback language is `es`.

## Code Style

- Follow **JavaScript Standard Style** (`standard`).
- Prettier config is inherited from `prettier-config-standard` — do not add a local `.prettierrc` unless required.
- Semicolons are **omitted** (Standard Style).

## Date Handling

- Uses **Moment.js** (not Day.js for the date pickers, despite `dayjs` being in dependencies).
- `Filters.js` imports `AdapterMoment` and wraps the app in `LocalizationProvider`.
- Date format in UI: `DD/MM/YYYY`.

## Deployment

- Deploy script: `scripts/deploy.sh <env>`.
- Requires a sibling config file: `scripts/deploy-<env>.conf` with `DEPLOYMENT_HOST`, `DEPLOYMENT_PORT`, `DEPLOYMENT_USER`, `DEPLOYMENT_PATH`.
- The script runs `npm run build:<env>` (uses `.env.<env>`) then rsyncs the `build/` folder.
- **No `.env*` files are tracked in git** — they are created locally or in the deployment repo.

## CI / GitHub Actions

- Workflow: `.github/workflows/main.yml`.
- Runs on Node 20 (`.nvmrc` says v22, but CI matrix uses 20).
- Steps: `npm install` → `npm install coveralls --save-dev` → `npm run test`.
- Uses `actions/checkout@v2` (older version).

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
