# esyfo-microfrontends

Astro 5 SSR monorepo that consolidates three separate microfrontends and a shared proxy backend into one application. Replaces `aktivitetskrav-mikrofrontend`, `dialogmote-mikrofrontend`, `meroppfolging-mikrofrontend`.

## Team
- **Team**: team-esyfo, NAV IT
- **Org**: navikt

## Commands

```bash
pnpm install                                    # Install all dependencies
pnpm run dev:dialogmote-microfrontend           # Dev server for dialogmote (Astro + Hono mock)
pnpm run dev:aktivitetskrav-microfrontend       # Dev server for aktivitetskrav
pnpm run dev:meroppfolging-microfrontend        # Dev server for meroppfolging
pnpm run build:dialogmote-microfrontend         # Build dialogmote workspace
pnpm run build:aktivitetskrav-microfrontend     # Build aktivitetskrav workspace
pnpm run build:meroppfolging-microfrontend      # Build meroppfolging workspace
```

Each workspace also has local scripts:
```bash
cd microfrontends/dialogmote
pnpm run dev          # Astro dev + mock server (concurrently)
pnpm run build        # astro check && astro build
pnpm run mock         # Hono mock server only (port 3000)
```

> **Note**: This repo uses pnpm workspaces. Workspace config is in `pnpm-workspace.yaml`. Dependencies are in root `package.json`.

## NAV Principles
- **Team First**: Autonomous teams with circles of autonomy
- **Product Development**: Continuous development over ad hoc approaches
- **Essential Complexity**: Focus on essential, avoid accidental complexity
- **DORA Metrics**: Measure and improve team performance

## Platform & Auth
- **Platform**: NAIS (Kubernetes on GCP)
- **Auth**: TokenX (on-behalf-of token exchange for backend calls), ID-porten (citizen login)
- **Observability**: OpenTelemetry auto-instrumentation via NAIS (`@opentelemetry/sdk-node`), structured logging via `pino`

## Architecture

### Monorepo Structure
pnpm workspaces with independent Astro apps under `microfrontends/`:

```
esyfo-microfrontends/
├── package.json                  # Root: shared dependencies + workspace scripts
├── microfrontends/
│   ├── dialogmote/               # Dialogmøte microfrontend (active)
│   ├── aktivitetskrav/               # Aktivitetskrav microfrontend (domain logic implemented)
│   └── meroppfolging/            # Meroppfølging microfrontend (not started)
```

Each workspace is a self-contained Astro SSR app with its own `Dockerfile`, `nais/` manifests, deploy workflow, and `astro.config.mjs`. Shared dependencies live in root `package.json`; workspace `package.json` files contain only scripts and metadata.

### Astro SSR
- **Output**: `server` mode with `@astrojs/node` adapter (standalone)
- **Pages**: `src/pages/[locale]/index.astro` — i18n routing with `nb`, `nn`, `en`
- **Middleware**: `src/middleware/index.ts` — validates TokenX tokens via `@navikt/oasis`
- **Health endpoints**: `src/pages/api/internal/isAlive.ts`, `isReady.ts`
- **Env schema**: Server secrets defined in `astro.config.mjs` via `envField` — imported from `astro:env/server`
- **Build output**: `dist/server/entry.mjs` (SSR server) + `dist/client/_astro/` (CDN assets)

### Islands Architecture
- Server-rendered `.astro` components handle layout and data fetching
- React components used as client islands via `client:only="react"` when interactivity is needed
- React 18 shared via import maps from NAV CDN (`importmap.json`) — not bundled

### Token Exchange
Each Astro workspace handles its own token exchange server-side:

1. Middleware validates incoming TokenX token → stores in `Astro.locals.token`
2. Page frontmatter calls `requestOboToken(token, clientId)` via `@navikt/oasis`
3. OBO token used to call backend APIs directly from the server
4. Backend URLs and client IDs configured via `astro:env/server` schema

### CSS Strategy
- `postcss-prefix-selector` scopes all CSS with a unique class per microfrontend (e.g., `.dialogmote-microfrontend`)
- CSS Modules (`.module.css`) for component-level scoping — excluded from prefix selector
- Aksel CSS imported as `@src/styles/aksel.css`
- `inlineStylesheets: "always"` in Astro build config

### Deploy
Per-workspace GitHub Actions workflow with path-based triggers:
1. `pnpm install --frozen-lockfile` + `pnpm run build:<workspace>`
2. CDN upload: `dist/client/_astro/` → `cdn.nav.no/min-side/<app-name>`
3. Docker build from workspace Dockerfile (distroless Node image)
4. Register in `tms-deploy` microfrontend manifest (SSR variant)
5. NAIS deploy to `dev-gcp` / `prod-gcp`

## Tech Stack
- **Framework**: Astro 5 (`astro`, `@astrojs/node`, `@astrojs/react`)
- **UI**: React 18, `@navikt/ds-react` (Aksel 6), `@navikt/aksel-icons`
- **Auth**: `@navikt/oasis` (TokenX validation + OBO token exchange)
- **Validation**: Zod (API response schemas in `schema/` directory)
- **Logging**: `pino` with structured JSON output
- **Observability**: `@opentelemetry/sdk-node` (auto-instrumented by NAIS)
- **Analytics**: `@navikt/nav-dekoratoren-moduler` (`getAnalyticsInstance`)
- **Lint/Format**: Biome (`@biomejs/biome`)
- **Mock server**: Hono + `@hono/node-server` (development)
- **Build tooling**: `rollup-plugin-import-map` (React from CDN), `postcss-prefix-selector`
- **Container**: `gcr.io/distroless/nodejs22-debian12` / `nodejs24-debian12`

## Conventions
- English code and comments — Norwegian for user-facing text and domain terms (e.g. dialogmøte, sykmelding, aktivitetskrav, motebehov)
- **Documentation lookup strategy** (prioritert rekkefølge):
  1. **Repo first**: Check existing code and custom instructions (`.github/instructions/`)
  2. **NAV-docs when needed**: Look up aksel.nav.no (UI components, design tokens) and doc.nais.io (platform, deploy, observability) when creating or changing something in these domains
  3. **External docs when uncertain**: Use web search for external libraries only when unsure about API correctness — not routinely
- Check existing code patterns in the repository before writing new code
- Follow the ✅ Always / ⚠️ Ask First / 🚫 Never boundaries in instruction files
- Biome for all formatting and linting (not ESLint/Prettier)
- Path aliases: `@src/*` → `src/*`, `@schema/*` → `schema/*` (in tsconfig.json)

## Migration Status

See `.github/instructions/migration.instructions.md` for full details.

| Workspace | Status | Notes |
|-----------|--------|-------|
| dialogmote | ✅ Active development | Domain logic migrated, components working. assetsPrefix still points to template repo. |
| aktivitetskrav | ✅ Active development | Domain logic, Zod schemas, components and mock server implemented. |
| meroppfolging | ⏳ Not started | Referenced in scripts and has deploy workflow, but directory doesn't exist yet. |

## Boundaries

### ✅ Always
- Fetch data server-side in Astro frontmatter — never client-side against NAV backends
- Validate tokens in middleware via `@navikt/oasis`
- Use Aksel components from `@navikt/ds-react`
- Use Zod for API response validation (schemas in `schema/` directory)
- Keep CSS prefix unique per microfrontend
- Run `pnpm run build` in the workspace to verify changes
- Use `astro:env/server` for server secrets — never expose to client

### ⚠️ Ask First
- Adding new dependencies (affects all workspaces via root `package.json`)
- Changing token exchange or auth flow
- Changing deploy workflow or NAIS manifest
- Sharing code between workspaces (consider if patterns should be duplicated or shared)
- Changing the import map configuration

### 🚫 Never
- Client-side data fetching against NAV backends (all data is fetched server-side)
- Skip TokenX validation in middleware
- Log tokens, PII, or fødselsnummer
- Import between workspaces without explicit sharing mechanism
- Bundle React (it's shared via import map from CDN)
- Use `getStaticPaths` (this is SSR, not SSG)

## Documentation and Working Notes

| Tier | Location | Purpose | Persists | Checked in |
|------|----------|---------|----------|------------|
| **Session** | `~/.copilot/session-state/` | Scratch work for one task | No | No |
| **Local notes** | `.local-notes/` | Plans, architecture drafts, research, AI reviews | Yes | No |
| **Permanent docs** | `docs/` | Finalized documentation (ADRs, API docs) | Yes | Yes |

**Defaults**: Planning/research/drafts → `.local-notes/`. Finalized docs → `docs/`. Task tracking → session state.

## Keeping Copilot Config in Sync

When making changes that affect patterns described in `.github/` config files (instructions, prompts, skills), **suggest** updating — but do not update automatically.

Examples: upgrading frameworks, changing test patterns, adding auth mechanisms, changing build tooling.

**Check the file header first** to determine where changes belong:

- **Managed files** (header: `<!-- Managed by esyfo-cli …-->`) — Do NOT edit locally. Changes will be overwritten by the next sync.
  Format: *"This change affects patterns in `.github/instructions/<file>`, which is managed by esyfo-cli. The source should be updated in the esyfo-cli repo under `copilot-config/`."*

- **Locally owned files** (no managed header) — Suggest updating the file directly in this repo.
  Format: *"This change affects patterns in `.github/instructions/<file>` — want me to update it?"*
