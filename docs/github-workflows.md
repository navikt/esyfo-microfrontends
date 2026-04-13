# GitHub workflows

Repoet bruker GitHub Actions for CI, Storybook og deploy av mikrofronter. CI kjører på pull request og merge queue. Deploy til dev skjer per mikrofrontend.

## Oversikt

| Workflow                 | Fil                                                   | Hva den gjør                                                                      |
| ------------------------ | ----------------------------------------------------- | --------------------------------------------------------------------------------- |
| CI                       | `.github/workflows/ci.yaml`                           | Kjører lint, check, tester, Storybook-build og build av alle mikrofronter         |
| Reusable CI              | `.github/workflows/ci-reusable.yml`                   | Deler CI-jobbene mellom triggere                                                  |
| Deploy per mikrofrontend | `deploy-*.yaml`                                       | Tynne wrappers med egne triggere og app-spesifikke verdier                        |
| Reusable deploy          | `.github/workflows/deploy-microfrontend-reusable.yml` | Bygger appen, laster opp assets til CDN, oppdaterer manifest og deployer til NAIS |
| Deploy Storybook         | `.github/workflows/deploy-storybook.yml`              | Bygger Storybook og publiserer til GitHub Pages                                   |

## Hva som skjer på pull request

`ci.yaml` kjører på pull request. Den kaller `ci-reusable.yml`, som igjen kjører:

- lint og check
- tester
- Storybook-build
- build av alle mikrofronter

Et eget merge gate-steg stopper merge hvis den gjenbrukbare CI-jobben feiler eller blir avbrutt.

## Hva som skjer når vi merger til `main`

Når endringer treffer `main`, skjer dette:

- Storybook blir bygget og publisert til GitHub Pages
- den relevante deploy-wrapperen kan starte deploy til dev

Deploy-wrapperne lytter på endringer i:

- sin egen mikrofrontend
- `packages/shared/**`
- `package.json`
- `pnpm-lock.yaml`
- sin egen workflowfil
- `.github/workflows/deploy-microfrontend-reusable.yml`

Det betyr at vi også får deploy til dev når vi merger endringer i selve deploy-oppsettet.

## Manuell kjøring

Alle deploy-wrapperne har `workflow_dispatch`. Når workflowen finnes på `main`, kan du starte den manuelt fra GitHub og velge hvilken branch eller commit som skal kjøres.

Det gir oss denne modellen:

- automatisk deploy til dev fra `main`
- manuell deploy fra branch når vi vil teste noe før merge

## Hvordan deployen er bygget opp

Wrapper-workflowen sender app-spesifikke verdier til `deploy-microfrontend-reusable.yml`. Den gjenbrukbare workflowen gjør resten:

1. installerer avhengigheter
2. bygger mikrofrontenden
3. laster opp client-assets til `cdn.nav.no/min-side/<appnavn>`
4. bygger og pusher Docker-image
5. oppdaterer mikrofrontend-manifestet i dev
6. deployer til NAIS i `dev-gcp`

## Prod-deploy

Prod-deploy er fortsatt skrudd av. Den gjenbrukbare deploy-workflowen har en seam for prod, men prod krever fortsatt:

- `main`
- `enable_prod: true`
- eksplisitte prod-verdier

I dagens wrappers er `enable_prod` satt til `false`.
