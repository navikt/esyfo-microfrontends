import { AKTIVITETSKRAV_URL } from "astro:env/server";
import type { MainPanelProps } from "@esyfo/shared/components";
import { getShortDateFormat } from "@esyfo/shared/dateUtils";
import type {
  AktivitetskravVurdering,
  OppfyltArsaker,
  UnntakArsaker,
} from "@schema/aktivitetskravVurderingSchema";

const UNDER_ARBEID_BODY_TEXT =
  "Les mer om aktivitetsplikten og hva den betyr for deg";
const DEFAULT_UNNTAK_BODY_TEXT =
  "NAV vurderer at du er unntatt fra aktivitetsplikten";
const DEFAULT_OPPFYLT_BODY_TEXT =
  "NAV vurderer at du oppfyller aktivitetsplikten";

const harVurdertHeadingText = "NAV har vurdert aktivitetsplikten din";
const vurdererHeadingText = "NAV vurderer aktivitetsplikten din";

type AktivitetskravStatus = AktivitetskravVurdering["status"];
type VurderingForStatus<S extends AktivitetskravStatus> = Extract<
  AktivitetskravVurdering,
  { status: S }
>;

type PanelResolver<S extends AktivitetskravStatus = AktivitetskravStatus> = (
  vurdering: VurderingForStatus<S>,
) => MainPanelProps;

type StatusPanelMap = {
  [S in AktivitetskravStatus]: PanelResolver<S>;
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

const resolveUnderArbeid = (): MainPanelProps => ({
  headingText: vurdererHeadingText,
  bodyText: UNDER_ARBEID_BODY_TEXT,
  href: AKTIVITETSKRAV_URL,
  alertStyle: "info",
});

const resolveUnntak = (
  vurdering: VurderingForStatus<"UNNTAK">,
): MainPanelProps => ({
  headingText: harVurdertHeadingText,
  bodyText: getUnntakBodyText(vurdering.arsaker.at(0)),
  href: AKTIVITETSKRAV_URL,
  alertStyle: "success",
  tag: {
    text: `Dato for vurdering: ${getShortDateFormat(vurdering.sistVurdert)}`,
    variant: "success-moderate",
  },
});

const resolveOppfylt = (
  vurdering: VurderingForStatus<"OPPFYLT">,
): MainPanelProps => ({
  headingText: harVurdertHeadingText,
  bodyText: getOppfyltBodyText(vurdering.arsaker.at(0)),
  href: AKTIVITETSKRAV_URL,
  alertStyle: "success",
  tag: {
    text: `Dato for vurdering: ${getShortDateFormat(vurdering.sistVurdert)}`,
    variant: "success-moderate",
  },
});

const resolveForhandsvarsel = (
  vurdering: VurderingForStatus<"FORHANDSVARSEL">,
): MainPanelProps => {
  if (!vurdering.journalpostId) {
    return resolveUnderArbeid();
  }

  return {
    headingText: vurdererHeadingText,
    bodyText: "NAV vurderer å stanse sykepengene dine",
    href: AKTIVITETSKRAV_URL,
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

const resolveIkkeAktuell = (
  vurdering: VurderingForStatus<"IKKE_AKTUELL">,
): MainPanelProps => ({
  headingText: harVurdertHeadingText,
  bodyText: "NAV vurderer at aktivitetsplikten ikke er aktuell for deg",
  href: AKTIVITETSKRAV_URL,
  alertStyle: "info",
  tag: {
    text: `Dato for vurdering: ${getShortDateFormat(vurdering.sistVurdert)}`,
    variant: "info-moderate",
  },
});

const resolveIkkeOppfylt = (
  vurdering: VurderingForStatus<"IKKE_OPPFYLT">,
): MainPanelProps => ({
  headingText: harVurdertHeadingText,
  bodyText: "NAV vurderer at du ikke oppfyller aktivitetsplikten",
  href: AKTIVITETSKRAV_URL,
  alertStyle: "error",
  tag: {
    text: `Dato for vurdering: ${getShortDateFormat(vurdering.sistVurdert)}`,
    variant: "error-moderate",
  },
});

const panelByStatus: StatusPanelMap = {
  NY: resolveUnderArbeid,
  NY_VURDERING: resolveUnderArbeid,
  AVVENT: resolveUnderArbeid,
  UNNTAK: resolveUnntak,
  OPPFYLT: resolveOppfylt,
  FORHANDSVARSEL: resolveForhandsvarsel,
  IKKE_AKTUELL: resolveIkkeAktuell,
  IKKE_OPPFYLT: resolveIkkeOppfylt,
};

export const resolvePanel = (
  aktivitetskravVurdering: AktivitetskravVurdering,
): MainPanelProps =>
  panelByStatus[aktivitetskravVurdering.status](
    aktivitetskravVurdering as never,
  );
