import { formatSvarfrist, formatVurderingsDato } from "@src/language/text";
import { describe, expect, it } from "vitest";
import { resolvePanel } from "./panelResolver";
import {
  createAvvent,
  createForhandsvarsel,
  createIkkeAktuell,
  createIkkeOppfylt,
  createNyVurdering,
  createNyVurderingStatus,
  createOppfyltFriskmeldt,
  createUnntakMedisinskGrunn,
} from "./test-utils/vurdering";

const now = new Date("2024-06-01T12:00:00.000Z");
const sistVurdert = "2024-01-15T00:00:00.000Z";
const fristBefore = "2024-05-01";
const fristAfter = "2024-07-01";
const expectedHref = "http://localhost:3000/syk/aktivitetskrav";

const expectResolvedPanel = (
  panel: ReturnType<typeof resolvePanel>,
): NonNullable<ReturnType<typeof resolvePanel>> => {
  expect(panel).not.toBeNull();
  if (!panel) {
    throw new Error("Expected panel to be resolved");
  }

  expect(panel.panelId).toBe("aktivitetskrav-panel");
  expect(panel.href).toBe(expectedHref);

  return panel;
};

describe("resolvePanel", () => {
  it("shows aktivitetsplikt is being evaluated for new cases", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createNyVurdering(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("Nav vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("shows aktivitetsplikt is being evaluated for new vurdering", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createNyVurderingStatus(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("Nav vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("shows aktivitetsplikt is being evaluated when on hold", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createAvvent(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("Nav vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("shows unntak granted for medical reasons", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createUnntakMedisinskGrunn(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("success");
    expect(panel.headingText).toBe("Nav har vurdert aktivitetsplikten din");
    expect(panel.bodyText).toContain("medisinske");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "success-moderate",
    });
  });

  it("shows generic unntak text when no reasons are given", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createUnntakMedisinskGrunn({
          arsaker: [],
        }),
        expectedHref,
        now,
      ),
    );

    expect(panel.bodyText).toBe(
      "Nav vurderer at du er unntatt fra aktivitetsplikten",
    );
  });

  it("shows aktivitetsplikt fulfilled when user is friskmeldt", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createOppfyltFriskmeldt(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("success");
    expect(panel.headingText).toBe("Nav har vurdert aktivitetsplikten din");
    expect(panel.bodyText).toContain("friskmeldt");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "success-moderate",
    });
  });

  it("shows aktivitetsplikt fulfilled when user is gradert", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createOppfyltFriskmeldt({
          arsaker: ["GRADERT"],
        }),
        expectedHref,
        now,
      ),
    );

    expect(panel.bodyText).toContain("gradert");
  });

  it("falls back to evaluation view for forhåndsvarsel without journal entry", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createForhandsvarsel({
          journalpostId: undefined,
        }),
        expectedHref,
        now,
      ),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("Nav vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("shows forhåndsvarsel warning when svarfrist has not passed", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createForhandsvarsel({
          fristDato: fristAfter,
        }),
        expectedHref,
        now,
      ),
    );

    expect(panel.alertStyle).toBe("warning");
    expect(panel.headingText).toBe("Nav vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe("Nav vurderer å stanse sykepengene dine");
    expect(panel.tag).toEqual({
      text: formatSvarfrist(fristAfter),
      variant: "warning-moderate",
    });
  });

  it("shows forhåndsvarsel error when svarfrist has passed", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createForhandsvarsel({
          fristDato: fristBefore,
        }),
        expectedHref,
        now,
      ),
    );

    expect(panel.tag).toEqual({
      text: formatSvarfrist(fristBefore),
      variant: "error-moderate",
    });
  });

  it("shows aktivitetsplikt is no longer relevant", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createIkkeAktuell(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("Nav har vurdert aktivitetsplikten din");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "info-moderate",
    });
  });

  it("returns no panel when aktivitetsplikt is not fulfilled", () => {
    const panel = resolvePanel(createIkkeOppfylt(), expectedHref, now);

    expect(panel).toBeUndefined();
  });
});
