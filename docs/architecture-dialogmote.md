# Arkitektur for dialogmøte

`dialogmote` viser status for dialogmøte på Min side. Mikrofrontenden henter brevdata fra `isdialogmote` og viser panelet når siste relevante brev er en innkalling eller et brev om nytt tid og sted.

## Flyt

```mermaid
flowchart LR
  U[Bruker] --> M[Min side]
  M --> D[dialogmote-microfrontend]
  D --> MW[Shared middleware]
  MW --> OBO[requestOboToken]
  OBO --> API[isdialogmote]
  API --> D
  D --> L[Lenke til dialogmøter]
```

## Hva appen gjør

1. Min side kaller SSR-appen.
2. Shared middleware validerer TokenX-tokenet.
3. `fetchBrev` henter data fra `isdialogmote` via `fetchFromBackend`.
4. Appen finner siste relevante brev.
5. Panelet vises bare når brevtypen er `INNKALT` eller `NYTT_TID_STED`.

## Backend og lenker

| Del                      | Verdi                              |
| ------------------------ | ---------------------------------- |
| Backend                  | `ISDIALOGMOTE_API_URL`             |
| Client ID for OBO        | `ISDIALOGMOTE_CLIENT_ID`           |
| Mål for lenken i panelet | `${DIALOGMOTE_URL}/moteinnkalling` |
| Manifest-id              | `syfo-dialog`                      |
