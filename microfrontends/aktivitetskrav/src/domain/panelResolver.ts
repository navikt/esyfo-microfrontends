import { AKTIVITETSKRAV_URL } from "astro:env/server";
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

const resolveUnderArbeid = (): MainPanelProps =>
  withPanelId({
    headingText: HeadingContent.vurderer,
    bodyText: BodyContent.underArbeid,
    href: AKTIVITETSKRAV_URL,
    alertStyle: "info",
  });

const resolveUnntak = (
  vurdering: VurderingForStatus<"UNNTAK">,
): MainPanelProps =>
  withPanelId({
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
): MainPanelProps =>
  withPanelId({
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
  now: Date,
): MainPanelProps => {
  if (!vurdering.journalpostId) {
    return resolveUnderArbeid();
  }

  return withPanelId({
    headingText: HeadingContent.vurderer,
    bodyText: BodyContent.forhandsvarsel,
    href: AKTIVITETSKRAV_URL,
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
): MainPanelProps =>
  withPanelId({
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
): MainPanelProps =>
  withPanelId({
    headingText: HeadingContent.harVurdert,
    bodyText: BodyContent.ikkeOppfylt,
    href: AKTIVITETSKRAV_URL,
    alertStyle: "error",
    tag: {
      text: formatVurderingsDato(vurdering.sistVurdert),
      variant: "error-moderate",
    },
  });

export const resolvePanel = (
  vurdering: AktivitetskravVurdering,
  now: Date = new Date(),
): MainPanelProps => {
  switch (vurdering.status) {
    case "NY":
    case "NY_VURDERING":
    case "AVVENT":
      return resolveUnderArbeid();
    case "UNNTAK":
      return resolveUnntak(vurdering);
    case "OPPFYLT":
      return resolveOppfylt(vurdering);
    case "FORHANDSVARSEL":
      return resolveForhandsvarsel(vurdering, now);
    case "IKKE_AKTUELL":
      return resolveIkkeAktuell(vurdering);
    case "IKKE_OPPFYLT":
      return resolveIkkeOppfylt(vurdering);
  }
};
