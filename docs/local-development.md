# Lokal utvikling

Kom i gang med `mise` først. Da får du riktig Node- og pnpm-versjon uten å sette dem opp manuelt.

## Installer verktøy

1. Installer [mise](https://mise.jdx.dev/).
2. Kjør `mise install` i rotkatalogen.
3. Kjør `mise run install` for å installere avhengigheter.

`mise.toml` styrer disse versjonene i repoet:

- Node 24
- pnpm 10

## Vanlige kommandoer

| Hva du vil gjøre | Med mise | Med pnpm |
| --- | --- | --- |
| Installere avhengigheter | `mise run install` | `pnpm install` |
| Starte dialogmøte lokalt | `mise run dev-dialogmote` | `pnpm run dev:dialogmote-microfrontend` |
| Starte aktivitetskrav lokalt | `mise run dev-aktivitetskrav` | `pnpm run dev:aktivitetskrav-microfrontend` |
| Starte meroppfølging lokalt | `mise run dev-meroppfolging` | `pnpm run dev:meroppfolging-microfrontend` |
| Starte motebehov lokalt | `mise run dev-motebehov` | `pnpm run dev:motebehov-microfrontend` |
| Kjøre tester | `mise run test` | `pnpm test` |
| Kjøre Storybook | `mise run storybook` | `pnpm run storybook` |
| Bygge Storybook | `mise run build-storybook` | `pnpm run build-storybook` |
| Kjøre full verifisering | `mise run verify` | `pnpm run check && pnpm test && pnpm run build:dialogmote-microfrontend && pnpm run build:aktivitetskrav-microfrontend && pnpm run build:meroppfolging-microfrontend && pnpm run build:motebehov-microfrontend && pnpm run build-storybook` |

## Lokal kjøring

Hver mikrofrontend har sitt eget dev-script i rotrepoet. Scriptet starter Astro og bruker mock-data i development.

Astro kjører på `http://localhost:4321`, og Storybook kjører på `http://localhost:6006`.

## Hva `mise run verify` gjør

`mise run verify` kjører det vi bruker som samlet kvalitetssjekk i repoet:

- `pnpm run check`
- `pnpm test`
- build av alle fire mikrofronter
- build av Storybook

Bruk denne kommandoen før du åpner en pull request når du vil sjekke hele repoet, ikke bare én mikrofrontend.
