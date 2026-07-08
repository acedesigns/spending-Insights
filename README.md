# Spending Insights

A responsive financial analytics dashboard that gives a customer a statement-style view
of their income, spend by category, and recent transactions.

All data is mocked — there is no backend in this repo — but the data layer is shaped
and isolated the way it would be against a real banking API, so swapping the mock for
a live endpoint is a one-file change (see [Architecture](#architecture)).

## Tech stack

| Concern              | Choice                                              |
| -------------------- | ---------------------------------------------------- |
| Framework            | React 19 + TypeScript, built with Vite              |
| Routing              | React Router v6 — loaders/actions, URL-driven state |
| Styling              | Chakra UI v3 (design-token theme, typegen'd)        |
| Charts               | Recharts                                            |
| Testing              | Vitest, React Testing Library, jsdom                |
| Linting / formatting | ESLint (flat config) + Prettier                     |
| Container            | Multi-stage Docker build served by nginx            |

I picked this stack because it's what I use day-to-day for client dashboards (React/TS
with a service-layer split), and it lets a reviewer run and change the app with nothing
beyond Node and Docker installed.

## Quick start

Requires Node. Built and tested against **Node v20.19** — other v20/v22 versions should
work fine, but if you hit install/build oddities, check `node -v` first.

```bash
npm install
npm run dev        # http://localhost:1997 (see vite.config.ts)
```

## Available scripts

| Script                  | What it does                                           |
| ----------------------- | ------------------------------------------------------ |
| `npm run dev`           | Start the Vite dev server with HMR                     |
| `npm run build`         | Type-check, then produce a production build in `dist/` |
| `npm run preview`       | Serve the production build locally                     |
| `npm run test`          | Run the test suite once                                |
| `npm run test:watch`    | Run tests in watch mode                                |
| `npm run test:coverage` | Run tests with a coverage report                       |
| `npm run lint`          | ESLint over the whole project                          |
| `npm run format`        | Format the project with Prettier                       |
| `npm run format:check`  | Check formatting without writing changes               |
| `npm run typecheck`     | `tsc` project-reference type check, no emit            |

## Running with Docker

You don't need Node installed on your machine at all for this path — Docker builds and
runs the app inside a container, an isolated little box with its own OS-level
environment. The Dockerfile is a **two-stage build**: a temporary stage compiles the
app with Node, then only the compiled static output is copied into a second, much
smaller stage that serves it with nginx (a web server). The Node toolchain itself never
ships in the final image.

### 1. Check whether Docker is installed

Open a terminal and run:

```bash
docker --version
```

- **If you see something like** `Docker version 27.x.x, build ...` — it's installed,
  skip to step 2.
- **If you see** `command not found: docker` (or similar) — it's not installed. Install
  [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your OS (Mac,
  Windows, or Linux), open the installer, and follow its prompts. This gives you both
  the `docker` command and the background service that runs containers.

### 2. Check whether Docker is actually running

Installing Docker Desktop puts an app on your machine, but the `docker` command only
works while that app is open and its engine has finished starting up. Check with:

```bash
docker info
```

- **A wall of text about containers, images, and server details** → Docker is running,
  move on to step 3.
- **An error like** `Cannot connect to the Docker daemon... Is the docker daemon
  running?` → open the Docker Desktop app from your Applications/Start menu and wait
  for its icon (whale in the menu bar / system tray) to show it's ready, then re-run
  `docker info`.

### 3. Build the image

From the project root (this folder):

```bash
docker build -t spending-insights-dashboard .
```

What this does: `docker build` reads the `Dockerfile` and follows its steps to produce
an **image** — a snapshot/template containing the built app and nginx, ready to run.
- `-t spending-insights-dashboard` **t**ags (names) the image so you can refer to it
  later instead of a random ID.
- `.` tells Docker to use the current directory as the **build context** (the set of
  files it's allowed to read while building, e.g. `package.json`, `src/`).

This step can take a minute or two the first time (downloading base images, installing
dependencies); later builds reuse cached layers and are faster.

### 4. Run the image as a container

```bash
docker run --rm -p 8080:8080 spending-insights-dashboard
```

- `docker run` starts a **container** — a live, running instance of the image.
- `--rm` automatically deletes that container once it stops, so you don't accumulate
  leftover stopped containers on disk.
- `-p 8080:8080` **p**ublishes a port: the left `8080` is the port on your machine, the
  right `8080` is the port the app listens on *inside* the container (see `EXPOSE 8080`
  in the `Dockerfile`). You could change the left number, e.g. `-p 3000:8080`, to serve
  it at `http://localhost:3000` instead.

Leave this terminal tab open — the container keeps running (and printing nginx logs)
in the foreground. Open your browser to:

```
http://localhost:8080
```

### 5. Stop it

Press `Ctrl+C` in the terminal where it's running. Because of `--rm`, the container is
cleaned up automatically — nothing left to delete manually.

### Useful follow-up commands

```bash
docker ps                              # list containers currently running
docker images                          # list images you've built/downloaded
docker rmi spending-insights-dashboard # delete the built image to free up space
```

### What nginx is doing in there

nginx is configured (`nginx.conf`) to gzip text assets, cache Vite's content-hashed
`/assets/*` files for a year, and always revalidate `index.html`. `/healthz` is wired
up as a `HEALTHCHECK` target for orchestrators (e.g. Kubernetes/ECS use it to know if
the container is healthy).

## CI/CD (GitHub Actions)

Five workflows in `.github/workflows/`, split into "check my code" and "deploy my
code":

| Workflow            | Trigger                             | What it does |
| -------------------- | ------------------------------------ | ------------- |
| `ci.yml`             | Push/PR to `main`                   | The gate everyone hits. Installs with `npm ci`, then runs `typecheck`, `lint`, `format:check`, `test:coverage`, and `build` — then a second job does `docker build` to prove the `Dockerfile` still builds. Nothing deploys here; it's pass/fail only. |
| `main.yml`           | Push to `main`                      | Calls the reusable `build-deploy.yml` with `environment: staging` → auto-deploys `main` to UAT. |
| `develop.yml`        | Push to `develop`                   | Calls `build-deploy.yml` with `environment: test` (+ `semantic-release` for versioning) to deploy DEV, then runs a second job that does a GitFlow-style merge of `develop` → `main` to kick off the UAT deploy above. |
| `build-deploy.yml`   | Not triggered directly — reusable, called by the three above | Node 20 + `yarn`, optional `semantic-release`, GraphQL codegen, `yarn build`, assumes an AWS IAM role via OIDC (no stored AWS keys), syncs `dist/` to S3, invalidates CloudFront. Environment-specific values (bucket, distribution ID, API host) live in GitHub's per-environment vars/secrets, not in the workflow file. |
| `deploy-manual.yml`  | Manual — Actions tab → "Manual Deploy" → Run workflow | Same reusable `build-deploy.yml`, but you pick the target environment (`test` / `staging` / `MetaV` / `MetaVProd`) from a dropdown instead of it being inferred from a branch. Equivalent of Bitbucket's old "custom" pipelines. |

**Two things worth knowing if you're touching these:**

- **`develop.yml`'s "Release to STAGING" job pauses for a human.** It targets a GitHub
  Environment called `release-gate` — if that environment has a required reviewer
  configured (Settings → Environments), the workflow run sits waiting for someone to
  click Approve before it merges `develop` into `main`. That's intentional — it's the
  manual gate that used to be a paused step in the old Bitbucket pipeline.
- **`npm` vs `yarn` split.** `ci.yml` (the check-only workflow) installs with `npm ci`,
  but the actual deploys in `build-deploy.yml` install with `yarn --frozen-lockfile`.
  That's inherited from this being ported off a Bitbucket/yarn setup — worth
  reconciling to one package manager if this repo's CI is going to be maintained
  long-term, since right now CI is checking a different dependency resolution than
  what actually ships.

## Architecture

```
src/
  main.tsx                    Router setup: createBrowserRouter, route tree, provider mount
  routes/
    root.tsx                  Root layout/loader for the whole app
    HomePage.tsx               Public landing page
    LoginPage.tsx / RegisterPage.tsx  Auth pages (guest-only, own loaders/actions)
    DashBoardPage.tsx          Dashboard route — loader fetches + aggregates data,
                                URL search params ARE the filter state (month, search,
                                category, account, type)
    ErrorPage.tsx
  layouts/
    AuthLayout.tsx             Redirects away if already authenticated
    ProtectedLayout.tsx        Redirects to /login if not authenticated
  types/spending.ts            Domain types (Transaction, Account, CategoryTotal, ...)
  data/                        Mock dataset: categories, accounts, deterministic
                                transaction generator (seeded, so output is stable)
  services/spendingService.ts  Async "API" boundary — the only file a real backend
                                integration would replace
  hooks/useSpendingData.ts     Legacy fetch-lifecycle hook (loading / data / error /
                                retry), superseded by DashBoardPage's loader but kept
                                + tested as the manual-fetch alternative
  utils/
    analytics.ts               Pure aggregation: monthly totals, category totals,
                                summary stats, filtering — unit tested in isolation
    formatters.ts               Currency (ZAR), date, and percentage formatting
  components/
    layout/Header.tsx, PageContainer.tsx
    NavBar/, Logo/
    cards/SummaryCard.tsx
    charts/                    SpendingTrendChart (income vs. expenses),
                                SpendingByCategoryChart (category donut + legend)
    transactions/               Filter bar + paginated table (card list on mobile)
    common/                    Loading, error, and empty states
  theme/                       Chakra UI v3 system + Provider (design tokens, typegen'd)
```

**Why loaders own the filter/data state, not a top-level component.** `DashBoardPage`'s
route `loader` reads the active month and every filter straight from the URL's
`searchParams`, fetches the snapshot, and runs the aggregation utilities server-render-
style before the component ever mounts. Filter changes (`TransactionFiltersBar`'s
`onChange`) just call `setSearchParams()`, which re-runs the loader — so the URL is the
single source of truth for "what am I looking at," it's shareable/bookmarkable, and
there's no `useEffect` fetch-on-mount dance in the dashboard itself. The older
`useSpendingData` hook (manual fetch lifecycle) is kept for the case where a route
isn't the right fit, and is unit tested independently.

**Why a service layer around the mock data.** `fetchSpendingSnapshot()` in
`services/spendingService.ts` returns a `Promise`, simulates network latency, and can
be forced to reject (used by the hook's and loader's unit tests). Every caller only
ever sees `SpendingSnapshot` / `Transaction` / `Account` types. That boundary is what
lets both the loader and `useSpendingData` — and therefore the whole UI — stay
identical when this function is later pointed at a real
`GET /accounts/{id}/transactions` endpoint.

**Why the aggregation logic is pulled out of components.** `computeMonthlyTotals`,
`computeCategoryTotals`, `computeSummary`, and `filterTransactions` are plain functions
with no React or DOM dependency. They're the part of the app with the most business
logic and the highest cost of a silent bug (wrong totals on a bank statement), so they
get the most direct test coverage rather than being asserted indirectly through
rendered component trees.

**Why the dataset is generated, not hand-written JSON.** `generateMockTransactions()`
uses a seeded PRNG (Mulberry32) over a realistic South African merchant/category list,
anchored to a fixed date (`MOCK_DATA_ANCHOR`) rather than `Date.now()`. That gives six
months of plausible, internally consistent transaction history — while staying fully
deterministic, so the same dataset renders in dev, in the built app, and in CI, and
tests never flake on data.

## Design notes

The visual direction leans into the domain: a digital bank statement rather than a
generic admin-panel dashboard. A warm paper background and ink/gold palette stand in
for a printed statement; all currency figures use a monospaced font with tabular
numerals so amounts align in a column the way they would on paper. Category and
income/expense colours are muted rather than saturated, since this is financial data a
customer needs to read calmly, not a marketing chart.

Accessibility basics: every chart has a text `aria-label` summarising what it shows,
all interactive controls are reachable and labelled for screen readers, focus states
are visible (`:focus-visible`), color is never the only signal (icons/labels back up
green/red amounts), and `prefers-reduced-motion` is respected.

## Testing approach

47 passing tests across 9 files (`npm run test`), covering:

- **Pure logic** (`utils/analytics.test.ts`, `utils/formatters.test.ts`,
  `data/mockTransactions.test.ts`) — the aggregation math, formatting edge cases
  (zero, negative-looking debit amounts, empty periods), and dataset determinism.
- **Hook behaviour** (`hooks/useSpendingData.test.ts`) — loading → success, loading →
  error, and that `retry()` actually re-fetches and can recover, using a mocked
  service module so no real timers are needed.
- **Components** (`SummaryCard`, `TransactionFiltersBar`, `TransactionTable`) — filter
  callbacks fire with the right shape, pagination math and button disabled-states,
  and the empty state's "Clear filters" action.
- **Integration** (`App.test.tsx`) — the full loading → rendered dashboard flow,
  filtering transactions end-to-end, and switching the active statement month.

Run `npm run test:coverage` for an HTML + text coverage report.

You'll see a harmless `recharts` / `ResponsiveContainer` warning in test output about
zero width/height — that's `jsdom` not doing real layout, not an application bug; the
tests assert on the chart's accessible label and surrounding DOM rather than on pixel
output.


## Author

Anele "Ace" Maqanda — AceDesigns · Full-stack consultant (fintech, banking, insurance,
telecoms).
