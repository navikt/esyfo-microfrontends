import type { MainPanelProps } from "@esyfo/shared/components";
import { getLongDateFormat } from "@esyfo/shared/dateUtils";
import type { BrevDto, SvarTypeDto } from "@schema/brevSchema";
import { BodyContent, HeadingContent, TagContent } from "@src/language/text";

const getTag = (
  attending: SvarTypeDto | null,
): NonNullable<MainPanelProps["tag"]> => {
  switch (attending) {
    case "KOMMER":
      return {
        text: TagContent.takketJa,
        variant: "success-moderate",
      };
    case "KOMMER_IKKE":
      return {
        text: TagContent.onskerAvlyse,
        variant: "neutral-moderate",
      };
    case "NYTT_TID_STED":
      return {
        text: TagContent.onskerEndre,
        variant: "neutral-moderate",
      };
    default:
      return {
        text: TagContent.ikkeSvart,
        variant: "warning-moderate",
      };
  }
};

const getBodyText = (brev: BrevDto, attending: SvarTypeDto | null): string => {
  if (attending !== "KOMMER") {
    if (brev.brevType === "NYTT_TID_STED") return BodyContent.motetFlyttet;
    if (brev.brevType === "ENDRET") return BodyContent.motetEndret;
  }

  return getLongDateFormat(brev.tid);
};

export const resolvePanel = (brev: BrevDto, href: string): MainPanelProps => {
  const attending = brev.svar?.svarType ?? null;

  return {
    headingText: HeadingContent.dialogmote,
    bodyText: getBodyText(brev, attending),
    href: `${href}/moteinnkalling`,
    alertStyle: attending ? "success" : "warning",
    panelId: "dialogmote-panel",
    tag: getTag(attending),
  };
};
