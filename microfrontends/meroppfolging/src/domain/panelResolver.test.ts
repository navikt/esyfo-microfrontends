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

describe("resolvePanel", () => {
  const evaluatedAt = new Date("2024-06-15T12:00:00.000Z");
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
  it("returns no panel when user has no oppfølging", () => {
    const panel = resolvePanel(
      createIngenOppfolging(),
      sspsUrl,
      kartleggingUrl,
      evaluatedAt,
    );

    expect(panel).toBeUndefined();
  });

  it("shows warning with last sykepenger date for sen oppfølging when user has not responded", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createSenOppfolgingNoResponse(),
        sspsUrl,
        kartleggingUrl,
        evaluatedAt,
      ),
    );

    expect(panel.alertStyle).toBe("warning");
    expect(panel.headingText).toBe("Snart slutt på sykepengene");
    expect(panel.bodyText).toContain("31. desember 2024");
    expect(panel.bodyText).toContain("er din siste dag med sykepenger");
    expect(panel.tag).toEqual({
      variant: "warning-moderate",
      text: "Du har ikke svart",
    });
    expect(panel.href).toBe(sspsUrl);
  });

  it("shows generic warning for sen oppfølging when last sykepenger date is unknown", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createSenOppfolgingNoResponse({
          maxDate: null,
        }),
        sspsUrl,
        kartleggingUrl,
        evaluatedAt,
      ),
    );

    expect(panel.bodyText).toContain(
      "Det nærmer seg siste dag du kan motta sykepenger",
    );
  });

  it("shows confirmation for sen oppfølging when user recently said they need oppfølging", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createSenOppfolgingTrengerOppfolging(),
        sspsUrl,
        kartleggingUrl,
        evaluatedAt,
      ),
    );

    expect(panel.alertStyle).toBe("success");
    expect(panel.headingText).toBe("Snart slutt på sykepengene");
    expect(panel.bodyText).toBe(
      "Du har svart at du ønsker oppfølging. Du får beskjed når vi har vurdert behovet ditt.",
    );
    expect(panel.tag?.variant).toBe("success-moderate");
    expect(panel.href).toBe(sspsUrl);
  });

  it("returns no panel for sen oppfølging when oppfølging response is older than one week", () => {
    const panel = resolvePanel(
      createSenOppfolgingTrengerOppfolging({
        responseDateTime: "2024-06-01T00:00:00.000Z",
      }),
      sspsUrl,
      kartleggingUrl,
      evaluatedAt,
    );

    expect(panel).toBeUndefined();
  });

  it("shows confirmation for sen oppfølging when user recently said they do not need oppfølging", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createSenOppfolgingTrengerIkkeOppfolging(),
        sspsUrl,
        kartleggingUrl,
        evaluatedAt,
      ),
    );

    expect(panel.bodyText).toBe(
      "Du har svart at du ikke trenger oppfølging nå. Du må ta kontakt hvis situasjonen din endrer seg.",
    );
    expect(panel.tag?.variant).toBe("success-moderate");
    expect(panel.href).toBe(sspsUrl);
  });

  it("returns no panel for sen oppfølging when no-oppfølging response is older than one week", () => {
    const panel = resolvePanel(
      createSenOppfolgingTrengerIkkeOppfolging({
        responseDateTime: "2024-06-01T00:00:00.000Z",
      }),
      sspsUrl,
      kartleggingUrl,
      evaluatedAt,
    );

    expect(panel).toBeUndefined();
  });

  it("shows warning for kartlegging when user has not responded", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createKartleggingNoResponse(),
        sspsUrl,
        kartleggingUrl,
        evaluatedAt,
      ),
    );

    expect(panel.alertStyle).toBe("warning");
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

  it("shows confirmation for kartlegging when user has submitted answers", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createKartleggingSubmitted(),
        sspsUrl,
        kartleggingUrl,
        evaluatedAt,
      ),
    );

    expect(panel.alertStyle).toBe("success");
    expect(panel.headingText).toBe("Kartlegging av din situasjon");
    expect(panel.bodyText).toBe("Se svarene du har sendt til Nav.");
    expect(panel.tag?.variant).toBe("success-moderate");
    expect(panel.href).toBe(kartleggingUrl);
  });

  it("falls back to warning for kartlegging when submitted but response date is missing", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createKartleggingSubmitted({
          responseDateTime: null,
        }),
        sspsUrl,
        kartleggingUrl,
        evaluatedAt,
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
