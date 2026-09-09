interface BackendFetchDefinition {
  eventType: `${string}_fetch_failed`;
  operation: string;
  message: string;
}

export const BACKEND_FETCH_CATALOG = {
  aktivitetskravVurdering: {
    eventType: "aktivitetskrav_vurdering_fetch_failed",
    operation: "hent_aktivitetskrav_vurdering",
    message: "Kunne ikke hente vurdering av aktivitetskravet",
  },
  dialogmoteBrev: {
    eventType: "dialogmote_brev_fetch_failed",
    operation: "hent_dialogmote_brev",
    message: "Kunne ikke hente brev om dialogmøte",
  },
  motebehovStatus: {
    eventType: "motebehov_status_fetch_failed",
    operation: "hent_motebehov_status",
    message: "Kunne ikke hente status for møtebehov",
  },
  meroppfolgingStatus: {
    eventType: "meroppfolging_status_fetch_failed",
    operation: "hent_meroppfolging_status",
    message: "Kunne ikke hente status for mer oppfølging",
  },
} as const satisfies Record<string, BackendFetchDefinition>;

export type BackendFetchDefinitionFromCatalog =
  (typeof BACKEND_FETCH_CATALOG)[keyof typeof BACKEND_FETCH_CATALOG];
