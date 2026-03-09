---
applyTo: "**/*"
---

# Migration Context

## What's Being Migrated

Three separate Vite/React microfrontends + one Express proxy backend → one Astro SSR monorepo.

| Old Repo | Type | Status | New Workspace |
|----------|------|--------|---------------|
| `aktivitetskrav-mikrofrontend` | Vite/React SPA | 🔄 Template phase | `microfrontends/aktivitetskrav-microfrontend` |
| `dialogmote-mikrofrontend` | Vite/React SPA | ✅ Active development | `microfrontends/dialogmote` |
| `meroppfolging-mikrofrontend` | Vite/React SPA | ⏳ Not started | `microfrontends/meroppfolging` |
| `esyfo-proxy` | Express.js backend | ✅ Replaced by Astro middleware | Built into each workspace |

## Architecture Changes

### Before (old architecture)
```
Browser → Client-side React SPA (Vite bundle)
            ↓ SWR fetch
         esyfo-proxy (Express)
            ↓ TokenX exchange (manual, with node-cache)
         Backend APIs (isdialogmote, syfomotebehov, etc.)
```

- React SPAs hosted as microfrontends in tms-min-side
- Data fetched client-side via SWR → esyfo-proxy
- esyfo-proxy: shared Express server handling TokenX exchange for all microfrontends
- Manual TokenX implementation using `openid-client`, `node-jose`, `jsonwebtoken`
- In-memory token caching via `node-cache`

### After (new architecture)
```
Browser → Astro SSR app (server-rendered HTML)
            ↓ Server-side fetch in frontmatter
         @navikt/oasis (requestOboToken)
            ↓ TokenX OBO exchange
         Backend APIs (isdialogmote, syfomotebehov, etc.)
```

- Astro SSR apps render data server-side — no client-side API calls
- Token exchange via `@navikt/oasis` (standard NAV library) — no custom implementation
- Each workspace handles its own token exchange independently
- No shared proxy — each workspace calls its backends directly

## esyfo-proxy Endpoints Being Replaced

Reference for which backend calls each workspace needs:

| Proxy Route | Backend Host | Backend Path | Client ID | Workspace |
|-------------|-------------|--------------|-----------|-----------|
| `GET /api/dialogmote` | `ISDIALOGMOTE_HOST` | `/api/v2/arbeidstaker/brev` | `ISDIALOGMOTE_CLIENT_ID` | dialogmote |
| `GET /api/motebehov` | `SYFOMOTEBEHOV_HOST` | `/syfomotebehov/api/v4/arbeidstaker/motebehov` | `SYFOMOTEBEHOV_CLIENT_ID` | dialogmote |
| `GET /api/aktivitetsplikt` | `AKTIVITETSKRAV_BACKEND_HOST` | (check esyfo-proxy routes) | `AKTIVITETSKRAV_BACKEND_CLIENT_ID` | aktivitetskrav |
| `GET /api/meroppfolging/v2/senoppfolging/status` | `MEROPPFOLGING_BACKEND_HOST` | `/api/v2/senoppfolging/status` | `MEROPPFOLGING_BACKEND_CLIENT_ID` | meroppfolging |
| `GET /api/mikrofrontend/v1/status` | `MEROPPFOLGING_BACKEND_HOST` | `/api/mikrofrontend/v1/status` | `MEROPPFOLGING_BACKEND_CLIENT_ID` | meroppfolging |

## Known Template Artifacts to Clean Up (aktivitetskrav workspace)

The aktivitetskrav workspace was scaffolded from `tms-microfrontend-template-ssr` and still contains template references:

- `package.json` name: `"tms-microfrontend-template-ssr"` → should be `"aktivitetskrav-microfrontend"`
- `astro.config.mjs` assetsPrefix: `"tms-microfrontend-template-ssr"` → update to `"aktivitetskrav-microfrontend"`
- `astro.config.mjs` CSS prefix: `".tms-microfrontend-template-ssr"` → update to `".aktivitetskrav-microfrontend"`
- `astro.config.mjs` env schema: `EXAMPLE_API_URL` → replace with actual backend env vars
- Placeholder data types and fetch logic → replace with aktivitetskrav domain types
- `nais/` manifests: verify namespace, team labels, access policies
- `src/styles/index.module.css`: contains debug border styling → remove

## Workspace Name Mismatch

⚠️ Root `package.json` workspaces reference `"microfrontends/aktivitetskrav"` but the actual directory is `microfrontends/aktivitetskrav-microfrontend`. This should be harmonized — either rename the directory or update the workspace path.

## Technology Migration Map

### Patterns NOT to carry forward from old repos

| Old Pattern | Replacement | Notes |
|-------------|-------------|-------|
| `styled-components` | CSS Modules + Aksel tokens | No runtime CSS-in-JS |
| `SWR` / client-side fetch | Server-side fetch in Astro frontmatter | Data fetched on server, not browser |
| `react-error-boundary` | Astro error handling (`return new Response(...)`) | Server-side error responses |
| `MSW` (Mock Service Worker) | Hono mock server (`mock/server.ts`) | Server-side mocks, not browser |
| `@grafana/faro-web-sdk` | OpenTelemetry auto-instrumentation (NAIS) | Platform-level observability |
| `ESLint` + `Prettier` | Biome | Single tool for lint + format |
| `Vite` config | Astro config (`astro.config.mjs`) | Vite is used internally by Astro |
| Manual TokenX (`openid-client`, `node-jose`) | `@navikt/oasis` (`requestOboToken`) | Standard NAV auth library |
| `node-cache` (token caching) | Not needed | `@navikt/oasis` handles caching |
| `dayjs` | Native date formatting or `@src/utils/dateUtils.ts` | Minimize dependencies |
| `@navikt/nav-dekoratoren-moduler` v2 | `@navikt/nav-dekoratoren-moduler` v3 | Updated analytics API |
| Aksel v5/v7 (mixed across repos) | Aksel v6 (consistent) | Standardized in monorepo |

## Migration Checklist per Workspace

When migrating a microfrontend, follow this pattern (using dialogmote as reference):

1. **Create workspace directory** under `microfrontends/`
2. **Set up Astro config** — copy from dialogmote, update CSS prefix, env schema, and assetsPrefix
3. **Create middleware** — copy from dialogmote (identical for all workspaces)
4. **Define Zod schemas** in `schema/` — port from old repo's schema files
5. **Create fetch utilities** in `src/utils/fetch.ts` — server-side with OBO token
6. **Build Astro components** — convert React components to `.astro` where possible
7. **Add React islands** only for interactive elements (`client:only="react"`)
8. **Set up mock server** in `mock/` — Hono endpoints matching the real API
9. **Create NAIS manifests** in `nais/` — dev-gcp and prod-gcp
10. **Create deploy workflow** in `.github/workflows/`
11. **Add root scripts** in root `package.json` (dev/build for the new workspace)
12. **Verify import map** — ensure `importmap.json` is present

## Planned: npm → pnpm

The monorepo uses npm workspaces today. Migration to pnpm is planned.

When migrating:
1. Delete `package-lock.json`
2. Create/update `.npmrc` for pnpm compatibility
3. Run `pnpm install` to generate `pnpm-lock.yaml`
4. Update root `package.json` scripts (`npm run` → `pnpm run`, `--workspace=` → `--filter`)
5. Update all GitHub Actions workflows (`npm ci` → `pnpm install --frozen-lockfile`, cache strategy)
6. Update Dockerfiles if they reference `npm`

Until then: use `npm` for all commands.
