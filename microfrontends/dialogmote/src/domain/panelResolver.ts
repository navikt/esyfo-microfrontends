import type { MainPanelProps } from "@esyfo/shared/components";
import { getLongDateFormat } from "@esyfo/shared/dateUtils";
import type { BrevDto, BrevTypeDto, SvarTypeDto } from "@schema/brevSchema";
import { BodyContent, HeadingContent, TagContent } from "@src/language/text";

const getTag = (
  attending: SvarTypeDto | null,
  brevType: BrevTypeDto,
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

export const resolvePanel = (brev: BrevDto, href: string): MainPanelProps => {
  const attending = brev.svar?.svarType ?? null;

  return {
    headingText: HeadingContent.dialogmote,
    bodyText:
      brev.brevType === "NYTT_TID_STED"
        ? BodyContent.motetFlyttet
        : getLongDateFormat(brev.tid),
    href: `${href}/moteinnkalling`,
    alertStyle: attending ? "success" : "warning",
    panelId: "dialogmote-panel",
    tag: getTag(attending, brev.brevType),
  };
};
