# esyfo-microfrontends

`esyfo-microfrontends` er et Astro SSR-monorepo for syfo-relaterte microfrontender på Min side (nav.no) for innloggede privatpersoner.

Repoet samler og erstatter fire tidligere repoer i én løsning:
- `aktivitetskrav-mikrofrontend`
- `dialogmote-mikrofrontend`
- `meroppfolging-mikrofrontend`
- `esyfo-proxy`

Microfrontendene aktiveres av [esyfovarsel](https://github.com/navikt/esyfovarsel) og følger [TMS-modellen for microfrontender på Min side](https://navikt.github.io/tms-dokumentasjon/microfrontend/).

## Arkitektur (ny løsning)

```mermaid
flowchart TD
  U[Bruker] --> M[Min side]

  subgraph MF[Astro SSR microfrontender]
    direction TB
    D[dialogmote]
    A[aktivitetskrav]
    MP[meroppfolging]
  end

  M --> D
  M --> A
  M --> MP

  D -- "TokenX OBO" --> B1[isdialogmote]
  D -- "TokenX OBO" --> B2[syfomotebehov]
  A -- "TokenX OBO" --> B3[aktivitetskrav-api]
```

Alle workspace-appene følger samme mønster: SSR i Astro, token-validering og OBO på serversiden, deretter kall til backend-APIer.

## Monorepostruktur

```text
esyfo-microfrontends/
├── package.json                  # Root: delte avhengigheter + workspace-scripts
├── microfrontends/
│   ├── dialogmote/               # Dialogmøte-microfrontend
│   ├── aktivitetskrav/           # Aktivitetskrav-microfrontend
│   └── meroppfolging/            # Meroppfølging-microfrontend (ikke påbegynt)
```

Repoet bruker **pnpm workspaces**. Workspace-konfigurasjonen ligger i `pnpm-workspace.yaml`, avhengigheter ligger i root `package.json`, og hvert workspace er en selvstendig Astro SSR-app med egne scripts, build og deploy.

## Teknologioversikt

| Kategori | Teknologi |
|----------|-----------|
| Framework | Astro 5 (SSR med @astrojs/node) |
| UI | React 18, @navikt/ds-react (Aksel) |
| Auth | @navikt/oasis (TokenX validering + OBO) |
| Validering | Zod |
| Logging | pino |
| Observability | OpenTelemetry (auto-instrumentert av NAIS) |
| Lint/format | Biome |
| Mock server | Hono |
| CSS-scoping | postcss-prefix-selector |
| Container | distroless Node.js |
| Plattform | NAIS (Kubernetes på GCP) |

## Lokal utvikling

```bash
pnpm install
pnpm run dev:dialogmote-microfrontend     # Astro dev + mock server
pnpm run dev:aktivitetskrav-microfrontend
```

Appen kjører på `http://localhost:4321/`. I dev brukes mock-server for å simulere backend-APIer.

## Bygging

```bash
pnpm run build:dialogmote-microfrontend
pnpm run build:aktivitetskrav-microfrontend
```

## Deploy-flyt

```mermaid
flowchart LR
  A[Push til main] --> B[GitHub Actions]
  B --> C[pnpm install --frozen-lockfile + build]
  C --> D[CDN-upload assets]
  D --> E[Docker build]
  E --> F[Registrer manifest]
  F --> G[NAIS deploy dev-gcp]
```

> **Merk:** Prod-deploy er foreløpig deaktivert. Kun dev-gcp er aktivt.

## Dependabot og automerge

Repoet bruker `.github/dependabot.yml` for ukentlige oppdateringer av rot-workspace-et og GitHub Actions. Trygg auto-godkjenning og auto-merge styres av `.github/workflows/dependabot-automerge.yml`, som kaller teamets reusable workflow fra `navikt/teamesyfo-github-actions-workflows`.

### Forventet policy

| Oppdateringstype | Behandles automatisk |
|------------------|----------------------|
| GitHub Actions | Ja, inkludert major |
| npm patch | Ja |
| npm minor | Ja |
| npm major | Nei, manuell vurdering |

### Påkrevd GitHub-oppsett

Følgende må være på plass for at Dependabot-PR-er skal kunne auto-merges trygt:

1. GitHub App-en `teamesyfo-automerge` må ha repository access til repoet.
2. Dependabot må ha tilgang til `AUTOMERGE_APP_PRIVATE_KEY` som Dependabot secret.
3. Dependabot må ha tilgang til `READER_TOKEN` for å kunne lese pakker fra `npm.pkg.github.com`.
4. Repository settings må ha `Allow auto-merge` aktivert.
5. Settings → Actions → General må bruke `Read and write permissions` og `Allow GitHub Actions to create and approve pull requests`.
6. Ruleset eller branch protection på `main` må kreve status checken `Merge gate`, siden den er CI-gaten for både `pull_request` og `merge_group`.

### Verifisering

Når oppsettet er aktivt, skal en Dependabot-PR for patch/minor enten auto-godkjennes og legges i merge queue eller vente på at `Merge gate` blir grønn. Major-oppdateringer utenfor GitHub Actions skal bli stående til manuell vurdering.

## Backend-integrasjoner

### Dialogmote
- `isdialogmote` (teamsykefravr) — dialogmøtebrev
- `syfomotebehov` (team-esyfo) — møtebehov

### Aktivitetskrav
- `aktivitetskrav-api` — aktivitetskravvurdering

### Meroppfolging
- Ikke påbegynt

## Migreringsstatus

| Workspace | Status | Merknad |
|-----------|--------|---------|
| dialogmote | ✅ Under aktiv utvikling | Domenelogikk migrert, deployes til dev |
| aktivitetskrav | ✅ Under aktiv utvikling | Domenelogikk implementert, deployes til dev |
| meroppfolging | ⏳ Ikke påbegynt | Workflow finnes, men kode mangler |
| esyfo-proxy | 🔄 Erstattet | Innebygd i hver workspace via Astro middleware |

## Kontakt

- **Team:** team-esyfo, Nav IT
- **Slack:** #team-esyfo
