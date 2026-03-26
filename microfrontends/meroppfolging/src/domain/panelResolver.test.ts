import { describe, expect, it } from "vitest";
import { resolvePanel } from "./panelResolver";
import {
  createIngenOppfolging,
  createKartleggingNoResponse,
  createKartleggingSubmitted,
  createSenOppfolgingNoResponse,
  createSenOppfolgingTrengerIkkeOppfolging,
  createSenOppfolgingTrengerOppfolging,
} from "./test-utils/meroppfolgingStatus";

const now = new Date("2024-06-15T12:00:00.000Z");
const sspsUrl =
  "https://test.nav.no/syk/meroppfolging/snart-slutt-pa-sykepengene";
const kartleggingUrl = "https://test.nav.no/syk/kartleggingssporsmal";

const expectResolvedPanel = (
  panel: ReturnType<typeof resolvePanel>,
): NonNullable<ReturnType<typeof resolvePanel>> => {
  expect(panel).not.toBeUndefined();
  if (!panel) {
    throw new Error("Expected panel to be resolved");
  }

  expect(panel.panelId).toBe("meroppfolging-panel");
  return panel;
};

describe("resolvePanel", () => {
  it("returns undefined for INGEN_OPPFOLGING", () => {
    const panel = resolvePanel(
      createIngenOppfolging(),
      sspsUrl,
      kartleggingUrl,
      now,
    );

    expect(panel).toBeUndefined();
  });

  it("resolves SEN_OPPFOLGING with NO_RESPONSE and maxDate to a warning panel", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createSenOppfolgingNoResponse(),
        sspsUrl,
        kartleggingUrl,
        now,
      ),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("Snart slutt på sykepengene");
    expect(panel.bodyText).toContain("31. desember 2024");
    expect(panel.bodyText).toContain("er din siste dag med sykepenger");
    expect(panel.tag).toEqual({
      variant: "warning-moderate",
      text: "Du har ikke svart",
    });
    expect(panel.href).toBe(sspsUrl);
  });

  it("resolves SEN_OPPFOLGING with NO_RESPONSE without maxDate to fallback body text", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createSenOppfolgingNoResponse({
          maxDate: null,
        }),
        sspsUrl,
        kartleggingUrl,
        now,
      ),
    );

    expect(panel.bodyText).toContain(
      "Det nærmer seg siste dag du kan motta sykepenger",
    );
  });

  it("resolves SEN_OPPFOLGING with TRENGER_OPPFOLGING and fresh response to a success panel", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createSenOppfolgingTrengerOppfolging(),
        sspsUrl,
        kartleggingUrl,
        now,
      ),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("Snart slutt på sykepengene");
    expect(panel.bodyText).toBe(
      "Du har svart at du ønsker oppfølging. Du får beskjed når vi har vurdert behovet ditt.",
    );
    expect(panel.tag?.variant).toBe("success-moderate");
    expect(panel.href).toBe(sspsUrl);
  });

  it("returns undefined for SEN_OPPFOLGING with TRENGER_OPPFOLGING and expired response", () => {
    const panel = resolvePanel(
      createSenOppfolgingTrengerOppfolging({
        responseDateTime: "2024-06-01T00:00:00.000Z",
      }),
      sspsUrl,
      kartleggingUrl,
      now,
    );

    expect(panel).toBeUndefined();
  });

  it("resolves SEN_OPPFOLGING with TRENGER_IKKE_OPPFOLGING and fresh response to a success panel", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createSenOppfolgingTrengerIkkeOppfolging(),
        sspsUrl,
        kartleggingUrl,
        now,
      ),
    );

    expect(panel.bodyText).toBe(
      "Du har svart at du ikke trenger oppfølging nå. Ta kontakt hvis situasjonen din endrer seg.",
    );
    expect(panel.tag?.variant).toBe("success-moderate");
    expect(panel.href).toBe(sspsUrl);
  });

  it("returns undefined for SEN_OPPFOLGING with TRENGER_IKKE_OPPFOLGING and expired response", () => {
    const panel = resolvePanel(
      createSenOppfolgingTrengerIkkeOppfolging({
        responseDateTime: "2024-06-01T00:00:00.000Z",
      }),
      sspsUrl,
      kartleggingUrl,
      now,
    );

    expect(panel).toBeUndefined();
  });

  it("resolves KARTLEGGING with NO_RESPONSE to a warning panel", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createKartleggingNoResponse(), sspsUrl, kartleggingUrl, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("Kartlegging av din situasjon");
    expect(panel.bodyText).toBe(
      "Vi ber deg svare på tre spørsmål om ditt sykefravær.",
    );
    expect(panel.tag).toEqual({
      variant: "warning-moderate",
      text: "Du har ikke svart",
    });
    expect(panel.href).toBe(kartleggingUrl);
  });

  it("resolves KARTLEGGING with SUBMITTED and responseDateTime to a success panel", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createKartleggingSubmitted(), sspsUrl, kartleggingUrl, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("Kartlegging av din situasjon");
    expect(panel.bodyText).toBe("Se svarene du har sendt til Nav.");
    expect(panel.tag?.variant).toBe("success-moderate");
    expect(panel.href).toBe(kartleggingUrl);
  });

  it("falls back to warning panel for KARTLEGGING with SUBMITTED without responseDateTime", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createKartleggingSubmitted({
          responseDateTime: null,
        }),
        sspsUrl,
        kartleggingUrl,
        now,
      ),
    );

    expect(panel.headingText).toBe("Kartlegging av din situasjon");
    expect(panel.bodyText).toBe(
      "Vi ber deg svare på tre spørsmål om ditt sykefravær.",
    );
    expect(panel.tag).toEqual({
      variant: "warning-moderate",
      text: "Du har ikke svart",
    });
    expect(panel.href).toBe(kartleggingUrl);
  });
});
