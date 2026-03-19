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
const DEFAULT_UNNTAK_BODY_TEXT =
  "NAV vurderer at du er unntatt fra aktivitetsplikten";
const DEFAULT_OPPFYLT_BODY_TEXT =
  "NAV vurderer at du oppfyller aktivitetsplikten";

type AktivitetskravStatus = AktivitetskravVurdering["status"];
type VurderingForStatus<S extends AktivitetskravStatus> = Extract<
  AktivitetskravVurdering,
  { status: S }
>;

type MainPanelPropsBuilder<
  S extends AktivitetskravStatus = AktivitetskravStatus,
> = (vurdering: VurderingForStatus<S>) => MainPanelProps;

type PanelPropsMap = {
  [S in AktivitetskravStatus]: MainPanelPropsBuilder<S>;
};

const unntakBodyTextByArsak: Record<UnntakArsaker, string> = {
  MEDISINSKE_GRUNNER:
    "Du er unntatt fra aktivitetsplikten på grunn av medisinske opplysninger",
  TILRETTELEGGING_IKKE_MULIG:
    "Du er unntatt fra aktivitetsplikten da tilrettelegging på arbeidsplassen ikke er mulig",
  SJOMENN_UTENRIKS: DEFAULT_UNNTAK_BODY_TEXT,
};

const oppfyltBodyTextByArsak: Record<OppfyltArsaker, string> = {
  FRISKMELDT:
    "NAV vurderer at du oppfyller aktivitetsplikten siden du er friskmeldt",
  GRADERT:
    "NAV vurderer at du oppfyller aktivitetsplikten siden du er i gradert arbeid",
  TILTAK: "NAV vurderer at du oppfyller aktivitetsplikten siden du er i tiltak",
};

const getUnntakBodyText = (arsak?: UnntakArsaker): string => {
  if (arsak) {
    return unntakBodyTextByArsak[arsak];
  }
  return DEFAULT_UNNTAK_BODY_TEXT;
};

const getOppfyltBodyText = (arsak?: OppfyltArsaker): string => {
  if (arsak) {
    return oppfyltBodyTextByArsak[arsak];
  }
  return DEFAULT_OPPFYLT_BODY_TEXT;
};

const getUnderArbeidPanelProps = (): MainPanelProps => ({
  headingText: vurdererHeadingText,
  bodyText: UNDER_ARBEID_BODY_TEXT,
  href: AKTIVITETSKRAV_HREF,
  alertStyle: "info",
});

const getUnntakPanelProps = (
  vurdering: VurderingForStatus<"UNNTAK">,
): MainPanelProps => ({
  headingText: harVurdertHeadingText,
  bodyText: getUnntakBodyText(vurdering.arsaker[0]),
  href: AKTIVITETSKRAV_HREF,
  alertStyle: "success",
  tag: {
    text: `Dato for vurdering: ${getShortDateFormat(vurdering.sistVurdert)}`,
    variant: "success-moderate",
  },
});

const getOppfyltPanelProps = (
  vurdering: VurderingForStatus<"OPPFYLT">,
): MainPanelProps => ({
  headingText: harVurdertHeadingText,
  bodyText: getOppfyltBodyText(vurdering.arsaker[0]),
  href: AKTIVITETSKRAV_HREF,
  alertStyle: "success",
  tag: {
    text: `Dato for vurdering: ${getShortDateFormat(vurdering.sistVurdert)}`,
    variant: "success-moderate",
  },
});

const getForhandsvarselPanelProps = (
  vurdering: VurderingForStatus<"FORHANDSVARSEL">,
): MainPanelProps => {
  if (!vurdering.journalpostId) {
    return getUnderArbeidPanelProps();
  }

  return {
    headingText: vurdererHeadingText,
    bodyText: "NAV vurderer å stanse sykepengene dine",
    href: AKTIVITETSKRAV_HREF,
    alertStyle: "warning",
    tag: {
      text: `Svarfrist: ${getShortDateFormat(vurdering.fristDato)}`,
      variant:
        new Date() > new Date(vurdering.fristDato)
          ? "error-moderate"
          : "warning-moderate",
    },
  };
};

const getIkkeAktuellPanelProps = (
  vurdering: VurderingForStatus<"IKKE_AKTUELL">,
): MainPanelProps => ({
  headingText: harVurdertHeadingText,
  bodyText: "NAV vurderer at aktivitetsplikten ikke er aktuell for deg",
  href: AKTIVITETSKRAV_HREF,
  alertStyle: "info",
  tag: {
    text: `Dato for vurdering: ${getShortDateFormat(vurdering.sistVurdert)}`,
    variant: "info-moderate",
  },
});

const getIkkeOppfyltPanelProps = (
  vurdering: VurderingForStatus<"IKKE_OPPFYLT">,
): MainPanelProps => ({
  headingText: harVurdertHeadingText,
  bodyText: "NAV vurderer at du ikke oppfyller aktivitetsplikten",
  href: AKTIVITETSKRAV_HREF,
  alertStyle: "error",
  tag: {
    text: `Dato for vurdering: ${getShortDateFormat(vurdering.sistVurdert)}`,
    variant: "error-moderate",
  },
});

const getPanelPropsByStatus: PanelPropsMap = {
  NY: getUnderArbeidPanelProps,
  NY_VURDERING: getUnderArbeidPanelProps,
  AVVENT: getUnderArbeidPanelProps,
  UNNTAK: getUnntakPanelProps,
  OPPFYLT: getOppfyltPanelProps,
  FORHANDSVARSEL: getForhandsvarselPanelProps,
  IKKE_AKTUELL: getIkkeAktuellPanelProps,
  IKKE_OPPFYLT: getIkkeOppfyltPanelProps,
};

export const getMainPanelProps = (
  aktivitetskravVurdering: AktivitetskravVurdering,
): MainPanelProps =>
  getPanelPropsByStatus[aktivitetskravVurdering.status](
    aktivitetskravVurdering as never,
  );
