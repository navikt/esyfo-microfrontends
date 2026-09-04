import { describe, expect, it } from "vitest";
import { BACKEND_FETCH_CATALOG } from "./backendFetchCatalog";

describe("BACKEND_FETCH_CATALOG", () => {
  const definitions = Object.values(BACKEND_FETCH_CATALOG);

  it("contains the complete code-owned backend fetch catalog", () => {
    expect(BACKEND_FETCH_CATALOG).toEqual({
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
    });
  });

  it("uses unique, contract-shaped event types and operations", () => {
    const eventTypes = definitions.map(({ eventType }) => eventType);
    const operations = definitions.map(({ operation }) => operation);

    expect(new Set(eventTypes).size).toBe(definitions.length);
    expect(new Set(operations).size).toBe(definitions.length);

    for (const definition of definitions) {
      expect(definition.eventType).toMatch(/^[a-z][a-z0-9_.-]{0,79}$/);
      expect(definition.eventType).toMatch(/_fetch_failed$/);
      expect(definition.operation).toMatch(/^[a-z][a-z0-9_.-]{0,79}$/);
      expect(definition.message.trim()).toBe(definition.message);
      expect(definition.message.length).toBeGreaterThan(0);
    }
  });
});
