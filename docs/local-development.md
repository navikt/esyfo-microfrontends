# Lokal utvikling

Kom i gang med `mise` først. Da får du riktig verktøyoppsett uten å sette alt opp manuelt.

## Installer verktøy

1. Installer [mise](https://mise.jdx.dev/).
2. Kjør `mise install` i rotkatalogen.
3. Kjør `mise run install` for å installere avhengigheter.

For å se tilgjengelige tasks i repoet:

```bash
mise tasks
```

Hvis du heller vil bruke `pnpm`, finner du de tilsvarende script-ene i `package.json`.

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
