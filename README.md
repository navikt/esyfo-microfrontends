# eSyfo microfrontends for Min side

[![Build Status](https://github.com/navikt/esyfo-microfrontends/actions/workflows/ci.yaml/badge.svg)](https://github.com/navikt/esyfo-microfrontends/actions/workflows/ci.yaml)

[![Astro](https://img.shields.io/badge/Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://storybook.js.org/)
[![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

Astro SSR-monorepo (server side rendering) for eSyfo-mikrofronter på Min side. Inneholder [aktivitetskrav](docs/aktivitetskravarkitektur.md), [dialogmøte](docs/dialogmotearkitektur.md)og [meroppfølging](docs/meroppfolgingsarkitektur.md), med felles [bygg og deploy](docs/github-workflows.md) og [dokumentasjon](#les-mer).

[🎬 Storybook](https://navikt.github.io/esyfo-microfrontends/)

[🧩 TMS (Team Min Side)-dokumentasjon for microfrontends](https://navikt.github.io/tms-dokumentasjon/microfrontend/)

## Formålet med repoet

Repoet samler eSyfo-mikrofronter som vises på Min side. Hver mikrofrontend er en Astro SSR-app som validerer token i middleware, henter data på serversiden og renderer et panel med felles komponenter fra `@esyfo/shared`.

Vi bruker [Storybook](https://navikt.github.io/esyfo-microfrontends/) til å vise tekster, tilstander og komponentvarianter uten å starte hele Min side. Det gjør det enklere å gå gjennom innhold, domenevarianter og UI-endringer.

```mermaid
flowchart LR
  U[Bruker] --> M[Min side]
  M --> T[TMS-manifest og aktivering]
  T --> D[SSR-mikrofrontend]
  D --> B[Syfo-backend]
  D --> C[CDN-assets]
```

## Mikrofronter i repoet

| Mikrofrontend                                         | Backend                         | Appnavn                      |
| ----------------------------------------------------- | ------------------------------- | ---------------------------- |
| [aktivitetskrav](docs/aktivitetskravarkitektur.md) | `aktivitetskrav-backend`        | aktivitetskrav-microfrontend |
| [dialogmøte](docs/dialogmotearkitektur.md)         | `isdialogmote`, `syfomotebehov` | dialogmote-microfrontend     |
| [meroppfølging](docs/meroppfolgingsarkitektur.md)   | `meroppfolging-backend`         | meroppfolging-microfrontend  |

## Les mer

- [Lokal utvikling](docs/local-development.md)
- [GitHub workflows](docs/github-workflows.md)
- [Aktivering og deaktivering i esyfovarsel](docs/microfrontend-activation.md) – inkluderer manifest-id-er
- [Integrasjon i Min side](docs/min-side-integration.md)
- [Arkitektur for dialogmøte](docs/dialogmotearkitektur.md)
- [Arkitektur for aktivitetskrav](docs/aktivitetskravarkitektur.md)
- [Arkitektur for meroppfølging](docs/meroppfolgingsarkitektur.md)

## For Nav-ansatte

Interne henvendelser kan sendes via Slack i kanalen [#esyfo](https://nav-it.slack.com/archives/C012X796B4L).
