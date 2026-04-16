import { getShortDateFormat } from "@esyfo/shared/dateUtils";
import type { OppfyltArsaker, UnntakArsaker } from "@schema/vurderingSchema";

export const HeadingContent = {
  vurderer: "Nav vurderer aktivitetsplikten din",
  harVurdert: "Nav har vurdert aktivitetsplikten din",
} as const;

export const BodyContent = {
  underArbeid: "Les mer om aktivitetsplikten og hva den betyr for deg",
  forhandsvarsel: "Nav vurderer å stanse sykepengene dine",
  ikkeAktuell: "Nav vurderer at aktivitetsplikten ikke er aktuell for deg",
} as const;

export const BodyDefaultContent = {
  unntak: "Nav vurderer at du er unntatt fra aktivitetsplikten",
  oppfylt: "Nav vurderer at du oppfyller aktivitetsplikten",
} as const;

export const unntakBodyTextByArsak: Record<UnntakArsaker, string> = {
  MEDISINSKE_GRUNNER:
    "Du er unntatt fra aktivitetsplikten på grunn av medisinske opplysninger",
  TILRETTELEGGING_IKKE_MULIG:
    "Du er unntatt fra aktivitetsplikten da tilrettelegging på arbeidsplassen ikke er mulig",
  SJOMENN_UTENRIKS: BodyDefaultContent.unntak,
};

export const oppfyltBodyTextByArsak: Record<OppfyltArsaker, string> = {
  FRISKMELDT:
    "Nav vurderer at du oppfyller aktivitetsplikten siden du er friskmeldt",
  GRADERT:
    "Nav vurderer at du oppfyller aktivitetsplikten siden du er i gradert arbeid",
  TILTAK: "Nav vurderer at du oppfyller aktivitetsplikten siden du er i tiltak",
};

export const getUnntakBodyText = (arsak?: UnntakArsaker): string =>
  arsak ? unntakBodyTextByArsak[arsak] : BodyDefaultContent.unntak;

export const getOppfyltBodyText = (arsak?: OppfyltArsaker): string =>
  arsak ? oppfyltBodyTextByArsak[arsak] : BodyDefaultContent.oppfylt;

export const formatVurderingsDato = (date: Date): string =>
  `Dato for vurdering: ${getShortDateFormat(date)}`;

export const formatSvarfrist = (date: Date): string =>
  `Svarfrist: ${getShortDateFormat(date)}`;
