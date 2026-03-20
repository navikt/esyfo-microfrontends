import { AKTIVITETSKRAV_URL } from "astro:env/server";
import type { MainPanelProps } from "@esyfo/shared/components";
import type { AktivitetskravVurdering } from "@schema/aktivitetskravVurderingSchema";
import {
  BodyContent,
  formatSvarfrist,
  formatVurderingsDato,
  getOppfyltBodyText,
  getUnntakBodyText,
  HeadingContent,
} from "@src/language/text";

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

const resolveUnderArbeid = (): MainPanelProps => ({
  headingText: HeadingContent.vurderer,
  bodyText: BodyContent.underArbeid,
  href: AKTIVITETSKRAV_URL,
  alertStyle: "info",
});

const resolveUnntak = (
  vurdering: VurderingForStatus<"UNNTAK">,
): MainPanelProps => ({
  headingText: HeadingContent.harVurdert,
  bodyText: getUnntakBodyText(vurdering.arsaker.at(0)),
  href: AKTIVITETSKRAV_URL,
  alertStyle: "success",
  tag: {
    text: formatVurderingsDato(vurdering.sistVurdert),
    variant: "success-moderate",
  },
});

const resolveOppfylt = (
  vurdering: VurderingForStatus<"OPPFYLT">,
): MainPanelProps => ({
  headingText: HeadingContent.harVurdert,
  bodyText: getOppfyltBodyText(vurdering.arsaker.at(0)),
  href: AKTIVITETSKRAV_URL,
  alertStyle: "success",
  tag: {
    text: formatVurderingsDato(vurdering.sistVurdert),
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
    headingText: HeadingContent.vurderer,
    bodyText: BodyContent.forhandsvarsel,
    href: AKTIVITETSKRAV_URL,
    alertStyle: "warning",
    tag: {
      text: formatSvarfrist(vurdering.fristDato),
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
  headingText: HeadingContent.harVurdert,
  bodyText: BodyContent.ikkeAktuell,
  href: AKTIVITETSKRAV_URL,
  alertStyle: "info",
  tag: {
    text: formatVurderingsDato(vurdering.sistVurdert),
    variant: "info-moderate",
  },
});

const resolveIkkeOppfylt = (
  vurdering: VurderingForStatus<"IKKE_OPPFYLT">,
): MainPanelProps => ({
  headingText: HeadingContent.harVurdert,
  bodyText: BodyContent.ikkeOppfylt,
  href: AKTIVITETSKRAV_URL,
  alertStyle: "error",
  tag: {
    text: formatVurderingsDato(vurdering.sistVurdert),
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
