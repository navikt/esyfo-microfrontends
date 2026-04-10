# Integrasjon i Min side

Mikrofrontene i dette repoet lever inne i Min side. De er ikke bygget som egne sluttbruker-apper med en offentlig hoved-URL. Min side laster dem inn når manifestet er registrert og brukeren er aktivert for den aktuelle mikrofrontenden.

## Slik henger det sammen

```mermaid
flowchart LR
  A[GitHub Actions] --> B[CDN-upload]
  A --> C[NAIS-deploy]
  A --> D[Manifestoppdatering]
  D --> E[Min side]
  E --> F[SSR-app i team-esyfo]
  F --> G[Syfo-backend]
```

## Delene i integrasjonen

### 1. Client-assets ligger på CDN

Hver Astro-app bygger client-assets med `assetsPrefix` mot `https://cdn.nav.no/min-side/<appnavn>`.

Det gjør at Min side kan hente JavaScript, CSS og andre statiske filer fra CDN.

### 2. SSR-appen kjører på NAIS

Hver mikrofrontend deployes som en egen app i `team-esyfo`. Appen renderer HTML på serversiden og kaller backendene med OBO-token.

### 3. Manifestet peker Min side til riktig app

Deploy-workflowen oppdaterer mikrofrontend-manifestet med:

- `manifest_id`
- intern URL for mikrofrontenden
- appnavn
- `ssr: true`

Manifestet forteller Min side hvor mikrofrontenden finnes.

### 4. Min side får lov til å kalle appen

NAIS-manifestene åpner for innkommende trafikk fra:

- `application: tms-min-side`
- `namespace: min-side`

Det er denne koblingen som lar Min side hente SSR-innholdet fra mikrofrontendene.

## Hva brukeren faktisk ser

Brukeren ser et lite panel på Min side. Panelet er ikke selve fagapplikasjonen. Det er en inngang til videre oppfølging, for eksempel dialogmøter, aktivitetskrav, møtebehov eller mer oppfølging.

Lenkene i panelene peker videre til vanlige Nav-sider. Mikrofrontenden har ansvar for å vise riktig tekst, status og lenke på Min side.

## Storybook i denne sammenhengen

Storybook er ikke en del av Min side-integrasjonen. Vi bruker Storybook til å vise komponenter, tekster og tilstander i isolasjon. Det gjør det enklere å gå gjennom innhold uten å trigge aktivering i Min side.
