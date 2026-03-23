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
  createOppfylt,
  createUnntak,
} from "./test-utils/vurdering";

const now = new Date("2024-06-01T12:00:00.000Z");
const sistVurdert = "2024-01-15T00:00:00.000Z";
const fristBefore = "2024-05-01T00:00:00.000Z";
const fristAfter = "2024-07-01T00:00:00.000Z";
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
  it("resolves NY to under arbeid state without tag", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createNyVurdering(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("resolves NY_VURDERING to under arbeid state without tag", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createNyVurderingStatus(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("resolves AVVENT to under arbeid state without tag", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createAvvent(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("resolves UNNTAK with MEDISINSKE_GRUNNER to a success panel", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createUnntak(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("success");
    expect(panel.headingText).toBe("NAV har vurdert aktivitetsplikten din");
    expect(panel.bodyText).toContain("medisinske");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "success-moderate",
    });
  });

  it("uses default unntak text when arsaker is empty", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createUnntak({
          arsaker: [],
        }),
        expectedHref,
        now,
      ),
    );

    expect(panel.bodyText).toBe(
      "NAV vurderer at du er unntatt fra aktivitetsplikten",
    );
  });

  it("resolves OPPFYLT with FRISKMELDT to a success panel", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createOppfylt(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("success");
    expect(panel.headingText).toBe("NAV har vurdert aktivitetsplikten din");
    expect(panel.bodyText).toContain("friskmeldt");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "success-moderate",
    });
  });

  it("resolves OPPFYLT with GRADERT body text", () => {
    const panel = expectResolvedPanel(
      resolvePanel(
        createOppfylt({
          arsaker: ["GRADERT"],
        }),
        expectedHref,
        now,
      ),
    );

    expect(panel.bodyText).toContain("gradert");
  });

  it("falls back to under arbeid for FORHANDSVARSEL without journalpostId", () => {
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
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("resolves FORHANDSVARSEL before frist with warning tag", () => {
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
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe("NAV vurderer å stanse sykepengene dine");
    expect(panel.tag).toEqual({
      text: formatSvarfrist(fristAfter),
      variant: "warning-moderate",
    });
  });

  it("resolves FORHANDSVARSEL after frist with error tag", () => {
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

  it("resolves IKKE_AKTUELL with info tag", () => {
    const panel = expectResolvedPanel(
      resolvePanel(createIkkeAktuell(), expectedHref, now),
    );

    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("NAV har vurdert aktivitetsplikten din");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "info-moderate",
    });
  });

  it("returns undefined for IKKE_OPPFYLT", () => {
    const panel = resolvePanel(createIkkeOppfylt(), expectedHref, now);

    expect(panel).toBeUndefined();
  });
});
