import type { MotebehovStatusDto } from "@schema/motebehovSchema";
import { describe, expect, it } from "vitest";
import { resolveCombinedPanel } from "./combinedPanelResolver";
import { resolveMotebehovPanel } from "./motebehovPanelResolver";
import { resolvePanel } from "./panelResolver";
import { createBrev } from "./test-utils/brev";

const expectedHref = "http://localhost:3000/syk/dialogmoter/sykmeldt";

const createMotebehovStatus = (
  overrides?: Partial<MotebehovStatusDto>,
): MotebehovStatusDto => ({
  visMotebehov: true,
  skjemaType: "SVAR_BEHOV",
  motebehov: null,
  ...overrides,
});

describe("resolveCombinedPanel", () => {
  it("prefers dialogmøte when both dialogmøte and motebehov can be shown", () => {
    const latestBrev = createBrev({ brevType: "INNKALT" });

    expect(
      resolveCombinedPanel(latestBrev, createMotebehovStatus(), expectedHref),
    ).toEqual(resolvePanel(latestBrev, expectedHref));
  });

  it("shows dialogmøte when motebehov is unavailable", () => {
    const latestBrev = createBrev({ brevType: "INNKALT" });

    expect(resolveCombinedPanel(latestBrev, null, expectedHref)).toEqual(
      resolvePanel(latestBrev, expectedHref),
    );
  });

  it("shows motebehov when dialogmøte should not be shown", () => {
    expect(
      resolveCombinedPanel(
        createBrev({ brevType: "AVLYST" }),
        createMotebehovStatus(),
        expectedHref,
      ),
    ).toEqual(resolveMotebehovPanel(expectedHref));
  });

  it("returns null when neither dialogmøte nor motebehov should be shown", () => {
    expect(
      resolveCombinedPanel(
        createBrev({ brevType: "AVLYST" }),
        createMotebehovStatus({ visMotebehov: false }),
        expectedHref,
      ),
    ).toBeNull();
  });
});
