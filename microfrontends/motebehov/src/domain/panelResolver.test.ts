import { describe, expect, it } from "vitest";

import { resolvePanel } from "./panelResolver";

describe("resolvePanel", () => {
  it("returns the expected panel props", () => {
    expect(resolvePanel()).toEqual({
      headingText: "Dialogmøte med NAV",
      bodyText: "Trenger du et dialogmøte?",
      href: "http://localhost:3000/syk/dialogmoter/sykmeldt/motebehov/svar",
      alertStyle: "warning",
      panelId: "motebehov-panel",
      tag: {
        text: "Du har ikke svart",
        variant: "warning-moderate",
      },
    });
  });

  it("uses the expected static panel fields", () => {
    const panel = resolvePanel();

    expect(panel.panelId).toBe("motebehov-panel");
    expect(panel.alertStyle).toBe("warning");
    expect(panel.headingText).toBe("Dialogmøte med NAV");
  });

  it("builds href for the motebehov answer page", () => {
    expect(resolvePanel().href).toContain("/motebehov/svar");
  });

  it("uses a warning tag when the user has not answered", () => {
    expect(resolvePanel().tag).toEqual({
      text: "Du har ikke svart",
      variant: "warning-moderate",
    });
  });
});
