import { describe, expect, it } from "vitest";

import { resolvePanel } from "./panelResolver";

const expectedHref = "http://localhost:3000/syk/dialogmoter/sykmeldt";

describe("resolvePanel", () => {
  it("returns the expected panel props", () => {
    expect(resolvePanel(expectedHref)).toEqual({
      headingText: "Dialogmøte med NAV",
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

  it("builds href for the motebehov answer page", () => {
    expect(resolvePanel(expectedHref).href).toBe(
      `${expectedHref}/motebehov/svar`,
    );
  });
});
