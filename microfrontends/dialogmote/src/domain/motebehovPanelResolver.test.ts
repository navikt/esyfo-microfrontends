import { describe, expect, it } from "vitest";

import { resolveMotebehovPanel } from "./motebehovPanelResolver";

const expectedHref = "http://localhost:3000/syk/dialogmoter/sykmeldt";

describe("resolveMotebehovPanel", () => {
  it("shows panel asking user if they need a dialogmøte", () => {
    expect(resolveMotebehovPanel(expectedHref)).toEqual({
      headingText: "Dialogmøte med Nav",
      bodyText: "Trenger du et dialogmøte?",
      href: `${expectedHref}/motebehov/svar`,
      alertStyle: "warning",
      panelId: "motebehov-panel",
      tag: {
        text: "Du har ikke svart",
        variant: "warning-moderate",
      },
    });
  });

  it("links to the møtebehov answer page", () => {
    expect(resolveMotebehovPanel(expectedHref).href).toBe(
      `${expectedHref}/motebehov/svar`,
    );
  });
});
