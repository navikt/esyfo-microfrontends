import type { MainPanelProps } from "@esyfo/shared/components";
import type { AktivitetskravVurdering } from "@schema/vurderingSchema";
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

const withPanelId = (
  panel: Omit<MainPanelProps, "panelId">,
): MainPanelProps => ({
  ...panel,
  panelId: "aktivitetskrav-panel",
});

const resolveUnderArbeid = (href: string): MainPanelProps =>
  withPanelId({
    headingText: HeadingContent.vurderer,
    bodyText: BodyContent.underArbeid,
    href,
    alertStyle: "info",
  });

const resolveUnntak = (
  vurdering: VurderingForStatus<"UNNTAK">,
  href: string,
): MainPanelProps =>
  withPanelId({
    headingText: HeadingContent.harVurdert,
    bodyText: getUnntakBodyText(vurdering.arsaker.at(0)),
    href,
    alertStyle: "success",
    tag: {
      text: formatVurderingsDato(vurdering.sistVurdert),
      variant: "success-moderate",
    },
  });

const resolveOppfylt = (
  vurdering: VurderingForStatus<"OPPFYLT">,
  href: string,
): MainPanelProps =>
  withPanelId({
    headingText: HeadingContent.harVurdert,
    bodyText: getOppfyltBodyText(vurdering.arsaker.at(0)),
    href,
    alertStyle: "success",
    tag: {
      text: formatVurderingsDato(vurdering.sistVurdert),
      variant: "success-moderate",
    },
  });

const resolveForhandsvarsel = (
  vurdering: VurderingForStatus<"FORHANDSVARSEL">,
  href: string,
  now: Date,
): MainPanelProps => {
  if (!vurdering.journalpostId) {
    return resolveUnderArbeid(href);
  }

  return withPanelId({
    headingText: HeadingContent.vurderer,
    bodyText: BodyContent.forhandsvarsel,
    href,
    alertStyle: "warning",
    tag: {
      text: formatSvarfrist(vurdering.fristDato),
      variant:
        now > new Date(vurdering.fristDato)
          ? "error-moderate"
          : "warning-moderate",
    },
  });
};

const resolveIkkeAktuell = (
  vurdering: VurderingForStatus<"IKKE_AKTUELL">,
  href: string,
): MainPanelProps =>
  withPanelId({
    headingText: HeadingContent.harVurdert,
    bodyText: BodyContent.ikkeAktuell,
    href,
    alertStyle: "info",
    tag: {
      text: formatVurderingsDato(vurdering.sistVurdert),
      variant: "info-moderate",
    },
  });

export const resolvePanel = (
  vurdering: AktivitetskravVurdering,
  href: string,
  now: Date,
): MainPanelProps | undefined => {
  switch (vurdering.status) {
    case "NY":
    case "NY_VURDERING":
    case "AVVENT":
      return resolveUnderArbeid(href);
    case "UNNTAK":
      return resolveUnntak(vurdering, href);
    case "OPPFYLT":
      return resolveOppfylt(vurdering, href);
    case "FORHANDSVARSEL":
      return resolveForhandsvarsel(vurdering, href, now);
    case "IKKE_AKTUELL":
      return resolveIkkeAktuell(vurdering, href);
    case "IKKE_OPPFYLT":
      return undefined;
  }
};
