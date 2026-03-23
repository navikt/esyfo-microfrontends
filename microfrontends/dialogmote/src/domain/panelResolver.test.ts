import { getLongDateFormat } from "@esyfo/shared/dateUtils";
import type { BrevDto, SvarTypeDto } from "@schema/brevSchema";
import { describe, expect, it } from "vitest";
import { resolvePanel } from "./panelResolver";
import { createBrev } from "./test-utils/brev";

const createSvar = (svarType: SvarTypeDto): NonNullable<BrevDto["svar"]> => ({
  svarTidspunkt: "2024-01-20T10:00:00.000Z",
  svarType,
  svarTekst: null,
});
const expectedHref = "http://localhost:3000/syk/dialogmoter/sykmeldt";

const expectCommonPanelFields = (panel: ReturnType<typeof resolvePanel>) => {
  expect(panel.panelId).toBe("dialogmote-panel");
  expect(panel.alertStyle).toBe("warning");
  expect(panel.headingText).toBe("Dialogmøte med NAV");
  expect(panel.href).toBe(`${expectedHref}/moteinnkalling`);
};

describe("resolvePanel", () => {
  it("resolves INNKALT without svar to warning tag", () => {
    const panel = resolvePanel(createBrev(), expectedHref);

    expectCommonPanelFields(panel);
    expect(panel.bodyText).toBe(getLongDateFormat("2024-02-01T10:00:00.000Z"));
    expect(panel.tag).toEqual({
      text: "Du har ikke svart",
      variant: "warning-moderate",
    });
  });

  it("resolves INNKALT with KOMMER to success tag", () => {
    const panel = resolvePanel(
      createBrev({
        svar: createSvar("KOMMER"),
      }),
      expectedHref,
    );

    expectCommonPanelFields(panel);
    expect(panel.tag).toEqual({
      text: "Du har takket ja",
      variant: "success-moderate",
    });
  });

  it("resolves INNKALT with KOMMER_IKKE to neutral tag", () => {
    const panel = resolvePanel(
      createBrev({
        svar: createSvar("KOMMER_IKKE"),
      }),
      expectedHref,
    );

    expectCommonPanelFields(panel);
    expect(panel.tag).toEqual({
      text: "Du ønsker å avlyse",
      variant: "neutral-moderate",
    });
  });

  it("resolves INNKALT with NYTT_TID_STED svar to neutral tag", () => {
    const panel = resolvePanel(
      createBrev({
        svar: createSvar("NYTT_TID_STED"),
      }),
      expectedHref,
    );

    expectCommonPanelFields(panel);
    expect(panel.tag).toEqual({
      text: "Du ønsker å endre tid eller sted",
      variant: "neutral-moderate",
    });
  });

  it("resolves NYTT_TID_STED without svar to moved meeting body and change tag", () => {
    const panel = resolvePanel(
      createBrev({
        brevType: "NYTT_TID_STED",
      }),
      expectedHref,
    );

    expectCommonPanelFields(panel);
    expect(panel.bodyText).toBe("Møtet med NAV er flyttet");
    expect(panel.tag).toEqual({
      text: "Se endringene og svar",
      variant: "warning-moderate",
    });
  });

  it("formats INNKALT body text from brev.tid", () => {
    const tid = "2024-06-10T12:00:00.000Z";
    const panel = resolvePanel(
      createBrev({
        tid,
      }),
      expectedHref,
    );

    expectCommonPanelFields(panel);
    expect(panel.bodyText).toBe(getLongDateFormat(tid));
    expect(panel.bodyText).toContain("2024");
  });
});
