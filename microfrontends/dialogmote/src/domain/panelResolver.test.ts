import { getLongDateFormat } from "@esyfo/shared/dateUtils";
import type { BrevDto, SvarTypeDto } from "@schema/brevSchema";
import { describe, expect, it } from "vitest";
import { resolvePanel } from "./panelResolver";
import { createBrev } from "./test-utils/brev";

describe("resolvePanel", () => {
  const createSvar = (svarType: SvarTypeDto): NonNullable<BrevDto["svar"]> => ({
    svarTidspunkt: "2024-01-20T10:00:00.000Z",
    svarType,
    svarTekst: null,
  });
  const expectedHref = "http://localhost:3000/syk/dialogmoter/sykmeldt";
  const svarTypeCases = [
    {
      svarType: "KOMMER",
      expectedTag: {
        text: "Du har takket ja",
        variant: "success-moderate",
      },
    },
    {
      svarType: "KOMMER_IKKE",
      expectedTag: {
        text: "Du ønsker å avlyse",
        variant: "neutral-moderate",
      },
    },
    {
      svarType: "NYTT_TID_STED",
      expectedTag: {
        text: "Du ønsker å endre tid eller sted",
        variant: "neutral-moderate",
      },
    },
  ] as const;

  const expectCommonPanelFields = (
    panel: ReturnType<typeof resolvePanel>,
    expectedAlertStyle: "warning" | "success" = "warning",
  ) => {
    expect(panel.panelId).toBe("dialogmote-panel");
    expect(panel.alertStyle).toBe(expectedAlertStyle);
    expect(panel.headingText).toBe("Dialogmøte med Nav");
    expect(panel.href).toBe(`${expectedHref}/moteinnkalling`);
  };

  it("shows warning when user is innkalt to dialogmøte but has not responded", () => {
    const panel = resolvePanel(createBrev(), expectedHref);

    expectCommonPanelFields(panel);
    expect(panel.bodyText).toBe(getLongDateFormat("2024-02-01T10:00:00.000Z"));
    expect(panel.tag).toEqual({
      text: "Du har ikke svart",
      variant: "warning-moderate",
    });
  });

  it.each(svarTypeCases)(
    "shows correct tag for $svarType response",
    ({ svarType, expectedTag }) => {
      const panel = resolvePanel(
        createBrev({
          svar: createSvar(svarType),
        }),
        expectedHref,
      );

      expectCommonPanelFields(panel, "success");
      expect(panel.tag).toEqual(expectedTag);
    },
  );

  it("shows warning when dialogmøte is rescheduled but user has not responded", () => {
    const panel = resolvePanel(
      createBrev({
        brevType: "NYTT_TID_STED",
      }),
      expectedHref,
    );

    expectCommonPanelFields(panel);
    expect(panel.bodyText).toBe("Møtet med Nav er flyttet");
    expect(panel.tag).toEqual({
      text: "Du har ikke svart",
      variant: "warning-moderate",
    });
  });

  it("shows meeting date when dialogmøte is rescheduled and user has accepted", () => {
    const tid = "2024-02-01T10:00:00.000Z";
    const panel = resolvePanel(
      createBrev({
        brevType: "NYTT_TID_STED",
        tid,
        svar: createSvar("KOMMER"),
      }),
      expectedHref,
    );

    expectCommonPanelFields(panel, "success");
    expect(panel.bodyText).toBe(getLongDateFormat(tid));
    expect(panel.tag).toEqual({
      text: "Du har takket ja",
      variant: "success-moderate",
    });
  });

  it("formats dialogmøte time from the invitation letter", () => {
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
