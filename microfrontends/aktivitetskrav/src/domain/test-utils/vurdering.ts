import type { AktivitetskravVurdering } from "@schema/vurderingSchema";

const sistVurdert = "2024-01-15T00:00:00.000Z";
const defaultFristDato = "2024-07-01";

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

export const createUnntakMedisinskGrunn = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "UNNTAK" }>>,
): Extract<AktivitetskravVurdering, { status: "UNNTAK" }> => ({
  status: "UNNTAK",
  arsaker: ["MEDISINSKE_GRUNNER"],
  sistVurdert,
  ...overrides,
});

export const createUnntakTilretteleggingIkkeMulig = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "UNNTAK" }>>,
): Extract<AktivitetskravVurdering, { status: "UNNTAK" }> => ({
  status: "UNNTAK",
  arsaker: ["TILRETTELEGGING_IKKE_MULIG"],
  sistVurdert,
  ...overrides,
});

export const createUnntakSjomennUtenriks = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "UNNTAK" }>>,
): Extract<AktivitetskravVurdering, { status: "UNNTAK" }> => ({
  status: "UNNTAK",
  arsaker: ["SJOMENN_UTENRIKS"],
  sistVurdert,
  ...overrides,
});

export const createOppfyltFriskmeldt = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "OPPFYLT" }>>,
): Extract<AktivitetskravVurdering, { status: "OPPFYLT" }> => ({
  status: "OPPFYLT",
  arsaker: ["FRISKMELDT"],
  sistVurdert,
  ...overrides,
});

export const createOppfyltGradert = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "OPPFYLT" }>>,
): Extract<AktivitetskravVurdering, { status: "OPPFYLT" }> => ({
  status: "OPPFYLT",
  arsaker: ["GRADERT"],
  sistVurdert,
  ...overrides,
});

export const createOppfyltTiltak = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "OPPFYLT" }>>,
): Extract<AktivitetskravVurdering, { status: "OPPFYLT" }> => ({
  status: "OPPFYLT",
  arsaker: ["TILTAK"],
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

export const createAutomatiskOppfylt = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "AUTOMATISK_OPPFYLT" }>
  >,
): Extract<AktivitetskravVurdering, { status: "AUTOMATISK_OPPFYLT" }> => ({
  status: "AUTOMATISK_OPPFYLT",
  sistVurdert,
  ...overrides,
});

export const createInnstillingOmStans = (
  overrides?: Partial<
    Extract<AktivitetskravVurdering, { status: "INNSTILLING_OM_STANS" }>
  >,
): Extract<AktivitetskravVurdering, { status: "INNSTILLING_OM_STANS" }> => ({
  status: "INNSTILLING_OM_STANS",
  sistVurdert,
  ...overrides,
});

export const createLukket = (
  overrides?: Partial<Extract<AktivitetskravVurdering, { status: "LUKKET" }>>,
): Extract<AktivitetskravVurdering, { status: "LUKKET" }> => ({
  status: "LUKKET",
  sistVurdert,
  ...overrides,
});
