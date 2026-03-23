import type { AktivitetskravVurdering } from "@schema/vurderingSchema";

const sistVurdert = "2024-01-15T00:00:00.000Z";
const defaultFristDato = "2024-07-01T00:00:00.000Z";

export const createNyVurdering = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "NY" }>>,
): Extract<AktivitetskravVurdering, { status: "NY" }> => ({
  status: "NY",
  ...overrides,
});

export const createNyVurderingStatus = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "NY_VURDERING" }>
  >,
): Extract<AktivitetskravVurdering, { status: "NY_VURDERING" }> => ({
  status: "NY_VURDERING",
  ...overrides,
});

export const createAvvent = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "AVVENT" }>>,
): Extract<AktivitetskravVurdering, { status: "AVVENT" }> => ({
  status: "AVVENT",
  sistVurdert,
  ...overrides,
});

export const createUnntak = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "UNNTAK" }>>,
): Extract<AktivitetskravVurdering, { status: "UNNTAK" }> => ({
  status: "UNNTAK",
  arsaker: ["MEDISINSKE_GRUNNER"],
  sistVurdert,
  ...overrides,
});

export const createOppfylt = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "OPPFYLT" }>>,
): Extract<AktivitetskravVurdering, { status: "OPPFYLT" }> => ({
  status: "OPPFYLT",
  arsaker: ["FRISKMELDT"],
  sistVurdert,
  ...overrides,
});

export const createForhandsvarsel = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "FORHANDSVARSEL" }>
  >,
): Extract<AktivitetskravVurdering, { status: "FORHANDSVARSEL" }> => ({
  status: "FORHANDSVARSEL",
  journalpostId: "journalpost-1",
  sistVurdert,
  fristDato: defaultFristDato,
  ...overrides,
});

export const createIkkeAktuell = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "IKKE_AKTUELL" }>
  >,
): Extract<AktivitetskravVurdering, { status: "IKKE_AKTUELL" }> => ({
  status: "IKKE_AKTUELL",
  sistVurdert,
  ...overrides,
});

export const createIkkeOppfylt = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "IKKE_OPPFYLT" }>
  >,
): Extract<AktivitetskravVurdering, { status: "IKKE_OPPFYLT" }> => ({
  status: "IKKE_OPPFYLT",
  sistVurdert,
  ...overrides,
});
