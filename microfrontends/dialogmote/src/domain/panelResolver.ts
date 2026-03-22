import { DIALOGMOTE_URL } from "astro:env/server";
import type { MainPanelProps } from "@esyfo/shared/components";
import { getLongDateFormat } from "@esyfo/shared/dateUtils";
import type { BrevDto, BrevTypeDto, SvarTypeDto } from "@schema/brevSchema";

const getTag = (
  attending: SvarTypeDto | null,
  brevType: BrevTypeDto,
): NonNullable<MainPanelProps["tag"]> => {
  switch (attending) {
    case "KOMMER":
      return {
        text: "Du har takket ja",
        variant: "success-moderate",
      };
    case "KOMMER_IKKE":
      return {
        text: "Du ønsker å avlyse",
        variant: "neutral-moderate",
      };
    case "NYTT_TID_STED":
      return {
        text: "Du ønsker å endre tid eller sted",
        variant: "neutral-moderate",
      };
    default:
      return {
        text:
          brevType === "NYTT_TID_STED"
            ? "Se endringene og svar"
            : "Du har ikke svart",
        variant: "warning-moderate",
      };
  }
};

export const resolvePanel = (brev: BrevDto): MainPanelProps => {
  const attending = brev.svar?.svarType ?? null;

  return {
    headingText: "Dialogmøte med NAV",
    bodyText:
      brev.brevType === "NYTT_TID_STED"
        ? "Møtet med NAV er flyttet"
        : getLongDateFormat(brev.tid),
    href: `${DIALOGMOTE_URL}/moteinnkalling`,
    alertStyle: "warning",
    tag: getTag(attending, brev.brevType),
  };
};
