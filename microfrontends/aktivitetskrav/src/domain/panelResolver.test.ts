import type { AktivitetskravVurdering } from "@schema/vurderingSchema";
import { formatSvarfrist, formatVurderingsDato } from "@src/language/text";
import { describe, expect, it } from "vitest";

import { resolvePanel } from "./panelResolver";

const now = new Date("2024-06-01T12:00:00.000Z");
const sistVurdert = "2024-01-15T00:00:00.000Z";
const fristBefore = "2024-05-01T00:00:00.000Z";
const fristAfter = "2024-07-01T00:00:00.000Z";
const expectedHref = "http://localhost:3000/syk/aktivitetskrav";

const createNyVurdering = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "NY" }>>,
): Extract<AktivitetskravVurdering, { status: "NY" }> => ({
  status: "NY",
  ...overrides,
});

const createNyVurderingStatus = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "NY_VURDERING" }>
  >,
): Extract<AktivitetskravVurdering, { status: "NY_VURDERING" }> => ({
  status: "NY_VURDERING",
  ...overrides,
});

const createAvvent = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "AVVENT" }>>,
): Extract<AktivitetskravVurdering, { status: "AVVENT" }> => ({
  status: "AVVENT",
  sistVurdert,
  ...overrides,
});

const createUnntak = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "UNNTAK" }>>,
): Extract<AktivitetskravVurdering, { status: "UNNTAK" }> => ({
  status: "UNNTAK",
  arsaker: ["MEDISINSKE_GRUNNER"],
  sistVurdert,
  ...overrides,
});

const createOppfylt = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "OPPFYLT" }>>,
): Extract<AktivitetskravVurdering, { status: "OPPFYLT" }> => ({
  status: "OPPFYLT",
  arsaker: ["FRISKMELDT"],
  sistVurdert,
  ...overrides,
});

const createForhandsvarsel = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "FORHANDSVARSEL" }>
  >,
): Extract<AktivitetskravVurdering, { status: "FORHANDSVARSEL" }> => ({
  status: "FORHANDSVARSEL",
  journalpostId: "journalpost-1",
  sistVurdert,
  fristDato: fristAfter,
  ...overrides,
});

const createIkkeAktuell = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "IKKE_AKTUELL" }>
  >,
): Extract<AktivitetskravVurdering, { status: "IKKE_AKTUELL" }> => ({
  status: "IKKE_AKTUELL",
  sistVurdert,
  ...overrides,
});

const createIkkeOppfylt = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "IKKE_OPPFYLT" }>
  >,
): Extract<AktivitetskravVurdering, { status: "IKKE_OPPFYLT" }> => ({
  status: "IKKE_OPPFYLT",
  sistVurdert,
  ...overrides,
});

const expectCommonPanelFields = (panel: ReturnType<typeof resolvePanel>) => {
  expect(panel.panelId).toBe("aktivitetskrav-panel");
  expect(panel.href).toBe(expectedHref);
};

describe("resolvePanel", () => {
  it("resolves NY to under arbeid state without tag", () => {
    const panel = resolvePanel(createNyVurdering(), now);

    expectCommonPanelFields(panel);
    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("resolves NY_VURDERING to under arbeid state without tag", () => {
    const panel = resolvePanel(createNyVurderingStatus(), now);

    expectCommonPanelFields(panel);
    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("resolves AVVENT to under arbeid state without tag", () => {
    const panel = resolvePanel(createAvvent(), now);

    expectCommonPanelFields(panel);
    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("resolves UNNTAK with MEDISINSKE_GRUNNER to a success panel", () => {
    const panel = resolvePanel(createUnntak(), now);

    expectCommonPanelFields(panel);
    expect(panel.alertStyle).toBe("success");
    expect(panel.headingText).toBe("NAV har vurdert aktivitetsplikten din");
    expect(panel.bodyText).toContain("medisinske");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "success-moderate",
    });
  });

  it("uses default unntak text when arsaker is empty", () => {
    const panel = resolvePanel(
      createUnntak({
        arsaker: [],
      }),
      now,
    );

    expectCommonPanelFields(panel);
    expect(panel.bodyText).toBe(
      "NAV vurderer at du er unntatt fra aktivitetsplikten",
    );
  });

  it("resolves OPPFYLT with FRISKMELDT to a success panel", () => {
    const panel = resolvePanel(createOppfylt(), now);

    expectCommonPanelFields(panel);
    expect(panel.alertStyle).toBe("success");
    expect(panel.headingText).toBe("NAV har vurdert aktivitetsplikten din");
    expect(panel.bodyText).toContain("friskmeldt");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "success-moderate",
    });
  });

  it("resolves OPPFYLT with GRADERT body text", () => {
    const panel = resolvePanel(
      createOppfylt({
        arsaker: ["GRADERT"],
      }),
      now,
    );

    expectCommonPanelFields(panel);
    expect(panel.bodyText).toContain("gradert");
  });

  it("falls back to under arbeid for FORHANDSVARSEL without journalpostId", () => {
    const panel = resolvePanel(
      createForhandsvarsel({
        journalpostId: undefined,
      }),
      now,
    );

    expectCommonPanelFields(panel);
    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe(
      "Les mer om aktivitetsplikten og hva den betyr for deg",
    );
    expect(panel.tag).toBeUndefined();
  });

  it("resolves FORHANDSVARSEL before frist with warning tag", () => {
    const panel = resolvePanel(
      createForhandsvarsel({
        fristDato: fristAfter,
      }),
      now,
    );

    expectCommonPanelFields(panel);
    expect(panel.alertStyle).toBe("warning");
    expect(panel.headingText).toBe("NAV vurderer aktivitetsplikten din");
    expect(panel.bodyText).toBe("NAV vurderer å stanse sykepengene dine");
    expect(panel.tag).toEqual({
      text: formatSvarfrist(fristAfter),
      variant: "warning-moderate",
    });
  });

  it("resolves FORHANDSVARSEL after frist with error tag", () => {
    const panel = resolvePanel(
      createForhandsvarsel({
        fristDato: fristBefore,
      }),
      now,
    );

    expectCommonPanelFields(panel);
    expect(panel.tag).toEqual({
      text: formatSvarfrist(fristBefore),
      variant: "error-moderate",
    });
  });

  it("resolves IKKE_AKTUELL with info tag", () => {
    const panel = resolvePanel(createIkkeAktuell(), now);

    expectCommonPanelFields(panel);
    expect(panel.alertStyle).toBe("info");
    expect(panel.headingText).toBe("NAV har vurdert aktivitetsplikten din");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "info-moderate",
    });
  });

  it("resolves IKKE_OPPFYLT with error tag", () => {
    const panel = resolvePanel(createIkkeOppfylt(), now);

    expectCommonPanelFields(panel);
    expect(panel.alertStyle).toBe("error");
    expect(panel.headingText).toBe("NAV har vurdert aktivitetsplikten din");
    expect(panel.tag).toEqual({
      text: formatVurderingsDato(sistVurdert),
      variant: "error-moderate",
    });
  });
});
