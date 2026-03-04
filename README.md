# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, you can enable stricter rules by extending the ESLint config. For example:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      // Other configs...
      reactX.configs.recommended,
      reactDom.configs.recommended,
    ],
  },
]);
```

## Load Testing (k6)

This project now includes basic load-testing configuration for your deployed Azure Static Web App.

### Files added

- `load-tests/smoke.js` → k6 smoke/load test script
- `.github/workflows/load-test.yml` → GitHub Action that runs after successful Azure deploy

### Run load test manually (local)

Install [k6](https://k6.io/docs/get-started/installation/) and run:

```bash
k6 run load-tests/smoke.js
```

Or test any URL:

```bash
BASE_URL=https://your-site-url k6 run load-tests/smoke.js
```

### Run via npm script

```bash
npm run load:test
```

### Automatic post-deploy test in GitHub Actions

After your Azure Static Web Apps workflow succeeds, this workflow runs automatically:

- Workflow name: **Post Deploy Load Test (k6)**
- Trigger: `workflow_run` of **Azure Static Web Apps CI/CD**

It runs the k6 script against:

`https://proud-pebble-067e3a310.4.azurestaticapps.net`

### Current thresholds in `load-tests/smoke.js`

- `http_req_failed < 1%`
- `p95 response time < 800ms`

You can tighten/relax these limits based on production expectations.
