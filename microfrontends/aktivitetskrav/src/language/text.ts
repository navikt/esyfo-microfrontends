import { getShortDateFormat } from "@esyfo/shared/dateUtils";
import type {
  OppfyltArsaker,
  UnntakArsaker,
} from "@schema/aktivitetskravVurderingSchema";

type HeadingContentKey = "vurderer" | "harVurdert";

export const HeadingContent: Record<HeadingContentKey, string> = {
  vurderer: "NAV vurderer aktivitetsplikten din",
  harVurdert: "NAV har vurdert aktivitetsplikten din",
};

type BodyContentKey =
  | "underArbeid"
  | "forhandsvarsel"
  | "ikkeAktuell"
  | "ikkeOppfylt";

export const BodyContent: Record<BodyContentKey, string> = {
  underArbeid: "Les mer om aktivitetsplikten og hva den betyr for deg",
  forhandsvarsel: "NAV vurderer å stanse sykepengene dine",
  ikkeAktuell: "NAV vurderer at aktivitetsplikten ikke er aktuell for deg",
  ikkeOppfylt: "NAV vurderer at du ikke oppfyller aktivitetsplikten",
};

type BodyDefaultContentKey = "unntak" | "oppfylt";

export const BodyDefaultContent: Record<BodyDefaultContentKey, string> = {
  unntak: "NAV vurderer at du er unntatt fra aktivitetsplikten",
  oppfylt: "NAV vurderer at du oppfyller aktivitetsplikten",
};

export const unntakBodyTextByArsak: Record<UnntakArsaker, string> = {
  MEDISINSKE_GRUNNER:
    "Du er unntatt fra aktivitetsplikten på grunn av medisinske opplysninger",
  TILRETTELEGGING_IKKE_MULIG:
    "Du er unntatt fra aktivitetsplikten da tilrettelegging på arbeidsplassen ikke er mulig",
  SJOMENN_UTENRIKS: BodyDefaultContent.unntak,
};

export const oppfyltBodyTextByArsak: Record<OppfyltArsaker, string> = {
  FRISKMELDT:
    "NAV vurderer at du oppfyller aktivitetsplikten siden du er friskmeldt",
  GRADERT:
    "NAV vurderer at du oppfyller aktivitetsplikten siden du er i gradert arbeid",
  TILTAK: "NAV vurderer at du oppfyller aktivitetsplikten siden du er i tiltak",
};

export const getUnntakBodyText = (arsak?: UnntakArsaker): string =>
  arsak ? unntakBodyTextByArsak[arsak] : BodyDefaultContent.unntak;

export const getOppfyltBodyText = (arsak?: OppfyltArsaker): string =>
  arsak ? oppfyltBodyTextByArsak[arsak] : BodyDefaultContent.oppfylt;

export const formatVurderingsDato = (date: string): string =>
  `Dato for vurdering: ${getShortDateFormat(date)}`;

export const formatSvarfrist = (date: string): string =>
  `Svarfrist: ${getShortDateFormat(date)}`;

// Backwards-compatible named exports for existing panel components.
export const harVurdertHeadingText = HeadingContent.harVurdert;
export const vurdererHeadingText = HeadingContent.vurderer;
