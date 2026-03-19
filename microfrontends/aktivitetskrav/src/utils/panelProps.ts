import type { MainPanelProps } from "@esyfo/shared/components";
import { getShortDateFormat } from "@esyfo/shared/dateUtils";
import type {
  AktivitetskravVurdering,
  OppfyltArsaker,
  UnntakArsaker,
} from "@schema/aktivitetskravVurderingSchema";
import { harVurdertHeadingText, vurdererHeadingText } from "@src/language/text";

const AKTIVITETSKRAV_HREF = "/syk/aktivitetskrav";
const UNDER_ARBEID_BODY_TEXT =
  "Les mer om aktivitetsplikten og hva den betyr for deg";

const getUnntakBodyText = (arsak?: UnntakArsaker): string => {
  switch (arsak) {
    case "MEDISINSKE_GRUNNER":
      return "Du er unntatt fra aktivitetsplikten på grunn av medisinske opplysninger";
    case "TILRETTELEGGING_IKKE_MULIG":
      return "Du er unntatt fra aktivitetsplikten da tilrettelegging på arbeidsplassen ikke er mulig";
    case "SJOMENN_UTENRIKS":
      return "NAV vurderer at du er unntatt fra aktivitetsplikten";
    default:
      return "NAV vurderer at du er unntatt fra aktivitetsplikten";
  }
};

const getOppfyltBodyText = (arsak?: OppfyltArsaker): string => {
  switch (arsak) {
    case "FRISKMELDT":
      return "NAV vurderer at du oppfyller aktivitetsplikten siden du er friskmeldt";
    case "GRADERT":
      return "NAV vurderer at du oppfyller aktivitetsplikten siden du er i gradert arbeid";
    case "TILTAK":
      return "NAV vurderer at du oppfyller aktivitetsplikten siden du er i tiltak";
    default:
      return "NAV vurderer at du oppfyller aktivitetsplikten";
  }
};

const getUnderArbeidPanelProps = (): MainPanelProps => ({
  headingText: vurdererHeadingText,
  bodyText: UNDER_ARBEID_BODY_TEXT,
  href: AKTIVITETSKRAV_HREF,
  alertStyle: "info",
});

export const getMainPanelProps = (
  aktivitetskravVurdering: AktivitetskravVurdering,
): MainPanelProps => {
  switch (aktivitetskravVurdering.status) {
    case "NY":
    case "NY_VURDERING":
    case "AVVENT":
      return getUnderArbeidPanelProps();
    case "UNNTAK":
      return {
        headingText: harVurdertHeadingText,
        bodyText: getUnntakBodyText(aktivitetskravVurdering.arsaker[0]),
        href: AKTIVITETSKRAV_HREF,
        alertStyle: "success",
        tag: {
          text: `Dato for vurdering: ${getShortDateFormat(aktivitetskravVurdering.sistVurdert)}`,
          variant: "success-moderate",
        },
      };
    case "OPPFYLT":
      return {
        headingText: harVurdertHeadingText,
        bodyText: getOppfyltBodyText(aktivitetskravVurdering.arsaker[0]),
        href: AKTIVITETSKRAV_HREF,
        alertStyle: "success",
        tag: {
          text: `Dato for vurdering: ${getShortDateFormat(aktivitetskravVurdering.sistVurdert)}`,
          variant: "success-moderate",
        },
      };
    case "FORHANDSVARSEL":
      if (!aktivitetskravVurdering.journalpostId) {
        return getUnderArbeidPanelProps();
      }

      return {
        headingText: vurdererHeadingText,
        bodyText: "NAV vurderer å stanse sykepengene dine",
        href: AKTIVITETSKRAV_HREF,
        alertStyle: "warning",
        tag: {
          text: `Svarfrist: ${getShortDateFormat(aktivitetskravVurdering.fristDato)}`,
          variant:
            new Date() > new Date(aktivitetskravVurdering.fristDato)
              ? "error-moderate"
              : "warning-moderate",
        },
      };
    case "IKKE_AKTUELL":
      return {
        headingText: harVurdertHeadingText,
        bodyText: "NAV vurderer at aktivitetsplikten ikke er aktuell for deg",
        href: AKTIVITETSKRAV_HREF,
        alertStyle: "info",
        tag: {
          text: `Dato for vurdering: ${getShortDateFormat(aktivitetskravVurdering.sistVurdert)}`,
          variant: "info-moderate",
        },
      };
    case "IKKE_OPPFYLT":
      return {
        headingText: harVurdertHeadingText,
        bodyText: "NAV vurderer at du ikke oppfyller aktivitetsplikten",
        href: AKTIVITETSKRAV_HREF,
        alertStyle: "error",
        tag: {
          text: `Dato for vurdering: ${getShortDateFormat(aktivitetskravVurdering.sistVurdert)}`,
          variant: "error-moderate",
        },
      };
  }
};
